"""
AWS Best Practices web scraping service module.

This module provides functions for scraping and analyzing content from the AWS Observability Best Practices website.
"""

import logging
import requests
from bs4 import BeautifulSoup
from typing import Dict, List, Optional, Any
import json
from urllib.parse import urljoin, urlparse
import time

logger = logging.getLogger(__name__)

def scrape_aws_best_practices(
    query: str,
    max_results: int = 5,
    base_url: str = "https://aws-observability.github.io/observability-best-practices/"
) -> Dict[str, Any]:
    """
    Search AWS Observability Best Practices website for relevant content.
    Returns actual search results with links.
    """
    try:
        # Use the search endpoint
        search_url = f"{base_url}search/?q={query}"
        response = requests.get(search_url, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract search results
        results = []
        
        # Look for search result containers - try different selectors
        search_results = []
        
        # Try common search result selectors
        selectors = [
            'div[class*="result"]',
            'div[class*="item"]', 
            'div[class*="card"]',
            'article',
            'section',
            'div[class*="content"]',
            'div[class*="search"]'
        ]
        
        for selector in selectors:
            found = soup.select(selector)
            if found:
                search_results.extend(found)
                break
        
        # If no specific results found, look for any content
        if not search_results:
            search_results = soup.find_all(['div', 'article', 'section', 'main'])
        
        for result in search_results:
            # Extract title
            title_elem = result.find(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) or result.find('a')
            title = title_elem.get_text().strip() if title_elem else "AWS Observability Best Practices"
            
            # Extract content
            content = _extract_result_content(result)
            
            # Extract link
            link = _extract_result_link(result, base_url)
            
            # Only include results that have substantial content
            if content and len(content) > 20:
                results.append({
                    "title": title,
                    "content": content,
                    "link": link,
                    "relevance_score": _calculate_relevance(title + " " + content, query)
                })
        
        # No fallback - only return actual search results
        
        # Sort by relevance and limit results
        results.sort(key=lambda x: x['relevance_score'], reverse=True)
        results = results[:max_results]
        
        return {
            "status": "success",
            "query": query,
            "results": results,
            "total_found": len(results),
            "source_url": search_url,
            "message": f"Found {len(results)} relevant results for query: {query}"
        }
        
    except requests.RequestException as e:
        logger.error(f"Error searching AWS Best Practices: {str(e)}")
        return {
            "status": "error",
            "message": f"Failed to search AWS Best Practices: {str(e)}",
            "results": []
        }
    except Exception as e:
        logger.error(f"Error searching AWS Best Practices: {str(e)}")
        return {
            "status": "error",
            "message": f"Error searching AWS Best Practices: {str(e)}",
            "results": []
        }

def _is_relevant(text: str, query: str) -> bool:
    """Check if text is relevant to the query."""
    query_lower = query.lower()
    text_lower = text.lower()
    
    # Check for direct matches
    if query_lower in text_lower:
        return True
    
    # Check for keyword matches
    keywords = query_lower.split()
    return any(keyword in text_lower for keyword in keywords if len(keyword) > 2)

def _calculate_relevance(text: str, query: str) -> float:
    """Calculate relevance score for text based on query."""
    text_lower = text.lower()
    query_lower = query.lower()
    
    score = 0.0
    
    # Direct match gets highest score
    if query_lower in text_lower:
        score += 10.0
    
    # Keyword matches
    keywords = query_lower.split()
    for keyword in keywords:
        if len(keyword) > 2 and keyword in text_lower:
            score += 1.0
    
    # Bonus for observability-related terms
    observability_terms = ['observability', 'monitoring', 'logging', 'metrics', 'tracing', 'cloudwatch', 'x-ray', 'rum']
    for term in observability_terms:
        if term in text_lower:
            score += 0.5
    
    return score

def _extract_content_after_heading(heading) -> str:
    """Extract content that follows a heading."""
    content_parts = []
    current = heading.find_next_sibling()
    
    while current and current.name not in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
        if current.name in ['p', 'div', 'ul', 'ol', 'li']:
            text = current.get_text().strip()
            if text:
                content_parts.append(text)
        current = current.find_next_sibling()
    
    return ' '.join(content_parts[:200])  # Limit content length

def _extract_result_content(result) -> str:
    """Extract content from a search result."""
    # Look for paragraphs, divs, or other content elements
    content_elements = result.find_all(['p', 'div', 'span', 'li'])
    content_parts = []
    
    for elem in content_elements:
        text = elem.get_text().strip()
        if text and len(text) > 10:  # Only include substantial text
            content_parts.append(text)
    
    # If no specific content found, get all text from the result
    if not content_parts:
        all_text = result.get_text().strip()
        if all_text:
            content_parts.append(all_text)
    
    return ' '.join(content_parts[:300])  # Limit content length

def _extract_result_link(result, base_url: str) -> str:
    """Extract link from a search result."""
    # Look for links within the result
    link_elem = result.find('a')
    if link_elem and link_elem.get('href'):
        href = link_elem.get('href')
        if href.startswith('http'):
            return href
        else:
            return urljoin(base_url, href)
    
    return base_url

def _extract_search_page_content(soup, query: str) -> str:
    """Extract content from the search page itself."""
    # Look for any text that mentions the query
    all_text = soup.get_text()
    lines = all_text.split('\n')
    
    relevant_lines = []
    query_lower = query.lower()
    
    for line in lines:
        line = line.strip()
        if line and query_lower in line.lower() and len(line) > 20:
            relevant_lines.append(line)
    
    return ' '.join(relevant_lines[:5])  # Return first 5 relevant lines

def _extract_heading_link(heading, base_url: str) -> str:
    """Extract link for a heading if it exists."""
    # Check if heading has an id
    heading_id = heading.get('id')
    if heading_id:
        return f"{base_url}#{heading_id}"
    
    # Check if heading contains a link
    link = heading.find('a')
    if link and link.get('href'):
        href = link.get('href')
        if href.startswith('http'):
            return href
        else:
            return urljoin(base_url, href)
    
    return base_url

def _find_section_content(soup, section_name: str) -> str:
    """Find content for a specific section."""
    # Look for section by name in various ways
    section_text = soup.find(text=lambda text: text and section_name.lower() in text.lower())
    if section_text:
        parent = section_text.parent
        if parent:
            return parent.get_text().strip()[:200]
    
    return ""


def get_aws_observability_guidance(
    question: str,
    context: Optional[str] = None
) -> Dict[str, Any]:
    """
    Search AWS Observability Best Practices portal and return links only.
    No fallback guidance - only actual search results from the portal.
    """
    try:
        # Enhance query with context if provided
        search_query = question
        if context:
            search_query = f"{question} {context}"
        
        # Search the best practices site
        search_results = scrape_aws_best_practices(search_query, max_results=10)
        
        # Always return the search URL
        search_url = f"https://aws-observability.github.io/observability-best-practices/search/?q={search_query}"
        
        response = {
            "status": "success",
            "question": question,
            "search_url": search_url,
            "links": []
        }
        
        # Only add actual search results as links
        if search_results.get("status") == "success" and search_results.get("results"):
            for result in search_results["results"]:
                # Only include results that have actual content and links
                if result.get("content") and result.get("link") and len(result["content"]) > 10:
                    response["links"].append({
                        "title": result["title"],
                        "url": result["link"],
                        "description": result["content"][:200] + "..." if len(result["content"]) > 200 else result["content"]
                    })
        
        # If no search results found, return empty links array
        if not response["links"]:
            response["status"] = "no_results"
            response["message"] = f"No specific results found for '{question}' in AWS Best Practices portal"
        
        return response
            
    except Exception as e:
        logger.error(f"Error searching AWS Best Practices: {str(e)}")
        return {
            "status": "error",
            "message": f"Error searching AWS Best Practices portal: {str(e)}",
            "search_url": f"https://aws-observability.github.io/observability-best-practices/search/?q={question}",
            "links": []
        }
