"""
RUM (Real User Monitoring) Analysis Playbook

This module implements comprehensive RUM analysis playbooks for user experience monitoring.
It provides functions to analyze AWS RUM data for performance, user experience, and mobile app monitoring.
"""

import logging
import boto3
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from services.aws_rum import analyze_rum_performance, get_user_experience_metrics, analyze_mobile_app_performance

logger = logging.getLogger(__name__)

def analyze_web_vitals(
    app_monitor_name: str,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    region: Optional[str] = None
) -> Dict[str, Any]:
    """
    Analyze Core Web Vitals from AWS RUM data.
    
    Args:
        app_monitor_name: AWS RUM app monitor name
        start_time: Start time for analysis (ISO format)
        end_time: End time for analysis (ISO format)
        region: AWS region
        
    Returns:
        Dictionary containing web vitals analysis
    """
    try:
        # Set default time range if not provided
        if not start_time:
            end_datetime = datetime.utcnow()
            start_datetime = end_datetime - timedelta(hours=24)
            start_time = start_datetime.isoformat() + 'Z'
            end_time = end_datetime.isoformat() + 'Z'
        elif not end_time:
            end_time = datetime.utcnow().isoformat() + 'Z'
        
        # Get user experience metrics which includes web vitals
        result = get_user_experience_metrics(
            app_monitor_name=app_monitor_name,
            start_time=start_time,
            end_time=end_time,
            region=region
        )
        
        if result.get("status") == "success":
            rum_data = result.get("data", {})
            
            # Extract web vitals data
            web_vitals = {
                "largest_contentful_paint": rum_data.get("largest_contentful_paint", {}),
                "first_input_delay": rum_data.get("first_input_delay", {}),
                "cumulative_layout_shift": rum_data.get("cumulative_layout_shift", {}),
                "first_contentful_paint": rum_data.get("first_contentful_paint", {}),
                "dom_content_loaded": rum_data.get("dom_content_loaded", {}),
                "load_complete": rum_data.get("load_complete", {})
            }
            
            # Analyze web vitals performance
            vitals_analysis = _analyze_web_vitals_performance(web_vitals)
            
            return {
                "status": "success",
                "data": {
                    "app_monitor": app_monitor_name,
                    "time_range": {"start": start_time, "end": end_time},
                    "web_vitals": web_vitals,
                    "performance_analysis": vitals_analysis,
                    "recommendations": _generate_web_vitals_recommendations(vitals_analysis)
                },
                "message": f"Analyzed web vitals for {app_monitor_name}"
            }
        else:
            return result
            
    except Exception as e:
        logger.error(f"Error analyzing web vitals: {str(e)}")
        return {
            "status": "error",
            "message": f"Error analyzing web vitals: {str(e)}"
        }

def analyze_user_journey_performance(
    app_monitor_name: str,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    region: Optional[str] = None
) -> Dict[str, Any]:
    """
    Analyze user journey performance and navigation patterns.
    
    Args:
        app_monitor_name: AWS RUM app monitor name
        start_time: Start time for analysis (ISO format)
        end_time: End time for analysis (ISO format)
        region: AWS region
        
    Returns:
        Dictionary containing user journey analysis
    """
    try:
        # Set default time range if not provided
        if not start_time:
            end_datetime = datetime.utcnow()
            start_datetime = end_datetime - timedelta(hours=24)
            start_time = start_datetime.isoformat() + 'Z'
            end_time = end_datetime.isoformat() + 'Z'
        elif not end_time:
            end_time = datetime.utcnow().isoformat() + 'Z'
        
        # Get RUM performance data
        result = analyze_rum_performance(
            app_monitor_name=app_monitor_name,
            start_time=start_time,
            end_time=end_time,
            region=region
        )
        
        if result.get("status") == "success":
            rum_data = result.get("data", {})
            
            # Extract user journey metrics
            journey_metrics = {
                "page_views": rum_data.get("page_views", {}),
                "sessions": rum_data.get("sessions", {}),
                "bounce_rate": rum_data.get("bounce_rate", {}),
                "session_duration": rum_data.get("session_duration", {}),
                "page_load_times": rum_data.get("page_load_times", {}),
                "navigation_timing": rum_data.get("navigation_timing", {})
            }
            
            # Analyze user journey performance
            journey_analysis = _analyze_user_journey_performance(journey_metrics)
            
            return {
                "status": "success",
                "data": {
                    "app_monitor": app_monitor_name,
                    "time_range": {"start": start_time, "end": end_time},
                    "journey_metrics": journey_metrics,
                    "performance_analysis": journey_analysis,
                    "recommendations": _generate_journey_recommendations(journey_analysis)
                },
                "message": f"Analyzed user journey performance for {app_monitor_name}"
            }
        else:
            return result
            
    except Exception as e:
        logger.error(f"Error analyzing user journey performance: {str(e)}")
        return {
            "status": "error",
            "message": f"Error analyzing user journey performance: {str(e)}"
        }

def analyze_mobile_app_health(
    app_monitor_name: str,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    region: Optional[str] = None
) -> Dict[str, Any]:
    """
    Analyze mobile app health and performance.
    
    Args:
        app_monitor_name: AWS RUM app monitor name
        start_time: Start time for analysis (ISO format)
        end_time: End time for analysis (ISO format)
        region: AWS region
        
    Returns:
        Dictionary containing mobile app health analysis
    """
    try:
        # Set default time range if not provided
        if not start_time:
            end_datetime = datetime.utcnow()
            start_datetime = end_datetime - timedelta(hours=24)
            start_time = start_datetime.isoformat() + 'Z'
            end_time = end_datetime.isoformat() + 'Z'
        elif not end_time:
            end_time = datetime.utcnow().isoformat() + 'Z'
        
        # Get mobile app performance data
        result = analyze_mobile_app_performance(
            app_monitor_name=app_monitor_name,
            start_time=start_time,
            end_time=end_time,
            region=region
        )
        
        if result.get("status") == "success":
            mobile_data = result.get("data", {})
            
            # Extract mobile app metrics
            mobile_metrics = {
                "crash_rate": mobile_data.get("crash_rate", {}),
                "app_launch_time": mobile_data.get("app_launch_time", {}),
                "screen_load_times": mobile_data.get("screen_load_times", {}),
                "network_errors": mobile_data.get("network_errors", {}),
                "user_engagement": mobile_data.get("user_engagement", {}),
                "device_performance": mobile_data.get("device_performance", {})
            }
            
            # Analyze mobile app health
            health_analysis = _analyze_mobile_app_health(mobile_metrics)
            
            return {
                "status": "success",
                "data": {
                    "app_monitor": app_monitor_name,
                    "time_range": {"start": start_time, "end": end_time},
                    "mobile_metrics": mobile_metrics,
                    "health_analysis": health_analysis,
                    "recommendations": _generate_mobile_health_recommendations(health_analysis)
                },
                "message": f"Analyzed mobile app health for {app_monitor_name}"
            }
        else:
            return result
            
    except Exception as e:
        logger.error(f"Error analyzing mobile app health: {str(e)}")
        return {
            "status": "error",
            "message": f"Error analyzing mobile app health: {str(e)}"
        }

def generate_rum_comprehensive_report(
    app_monitor_name: str,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    region: Optional[str] = None
) -> Dict[str, Any]:
    """
    Generate comprehensive RUM analysis report.
    
    Args:
        app_monitor_name: AWS RUM app monitor name
        start_time: Start time for analysis (ISO format)
        end_time: End time for analysis (ISO format)
        region: AWS region
        
    Returns:
        Dictionary containing comprehensive RUM analysis report
    """
    try:
        # Run all RUM analysis functions
        web_vitals_analysis = analyze_web_vitals(app_monitor_name, start_time, end_time, region)
        journey_analysis = analyze_user_journey_performance(app_monitor_name, start_time, end_time, region)
        mobile_analysis = analyze_mobile_app_health(app_monitor_name, start_time, end_time, region)
        
        # Compile comprehensive report
        report = {
            "status": "success",
            "data": {
                "app_monitor": app_monitor_name,
                "time_range": {"start": start_time, "end": end_time},
                "analysis_timestamp": datetime.utcnow().isoformat() + 'Z',
                "web_vitals_analysis": web_vitals_analysis,
                "journey_analysis": journey_analysis,
                "mobile_analysis": mobile_analysis,
                "summary": {
                    "overall_health_score": _calculate_overall_health_score(web_vitals_analysis, journey_analysis, mobile_analysis),
                    "critical_issues": _identify_critical_issues(web_vitals_analysis, journey_analysis, mobile_analysis)
                }
            },
            "message": f"Generated comprehensive RUM analysis report for {app_monitor_name}"
        }
        
        return report
        
    except Exception as e:
        logger.error(f"Error generating RUM comprehensive report: {str(e)}")
        return {
            "status": "error",
            "message": f"Error generating RUM comprehensive report: {str(e)}"
        }

def _analyze_web_vitals_performance(web_vitals: Dict) -> Dict[str, Any]:
    """Analyze web vitals performance against Core Web Vitals thresholds."""
    analysis = {
        "lcp_score": "good",
        "fid_score": "good", 
        "cls_score": "good",
        "overall_score": "good"
    }
    
    # LCP thresholds: Good < 2.5s, Needs Improvement 2.5-4s, Poor > 4s
    lcp_data = web_vitals.get("largest_contentful_paint", {})
    if lcp_data:
        lcp_p50 = lcp_data.get("p50", 0)
        if lcp_p50 > 4000:
            analysis["lcp_score"] = "poor"
        elif lcp_p50 > 2500:
            analysis["lcp_score"] = "needs_improvement"
    
    # FID thresholds: Good < 100ms, Needs Improvement 100-300ms, Poor > 300ms
    fid_data = web_vitals.get("first_input_delay", {})
    if fid_data:
        fid_p50 = fid_data.get("p50", 0)
        if fid_p50 > 300:
            analysis["fid_score"] = "poor"
        elif fid_p50 > 100:
            analysis["fid_score"] = "needs_improvement"
    
    # CLS thresholds: Good < 0.1, Needs Improvement 0.1-0.25, Poor > 0.25
    cls_data = web_vitals.get("cumulative_layout_shift", {})
    if cls_data:
        cls_p50 = cls_data.get("p50", 0)
        if cls_p50 > 0.25:
            analysis["cls_score"] = "poor"
        elif cls_p50 > 0.1:
            analysis["cls_score"] = "needs_improvement"
    
    # Calculate overall score
    scores = [analysis["lcp_score"], analysis["fid_score"], analysis["cls_score"]]
    if "poor" in scores:
        analysis["overall_score"] = "poor"
    elif "needs_improvement" in scores:
        analysis["overall_score"] = "needs_improvement"
    
    return analysis

def _analyze_user_journey_performance(journey_metrics: Dict) -> Dict[str, Any]:
    """Analyze user journey performance metrics."""
    analysis = {
        "bounce_rate_score": "good",
        "session_duration_score": "good",
        "page_load_score": "good",
        "overall_engagement": "good"
    }
    
    # Bounce rate analysis
    bounce_rate = journey_metrics.get("bounce_rate", {})
    if bounce_rate:
        avg_bounce_rate = bounce_rate.get("average", 0)
        if avg_bounce_rate > 70:
            analysis["bounce_rate_score"] = "poor"
        elif avg_bounce_rate > 50:
            analysis["bounce_rate_score"] = "needs_improvement"
    
    # Session duration analysis
    session_duration = journey_metrics.get("session_duration", {})
    if session_duration:
        avg_duration = session_duration.get("average", 0)
        if avg_duration < 30:  # Less than 30 seconds
            analysis["session_duration_score"] = "poor"
        elif avg_duration < 60:  # Less than 1 minute
            analysis["session_duration_score"] = "needs_improvement"
    
    # Page load time analysis
    page_load_times = journey_metrics.get("page_load_times", {})
    if page_load_times:
        avg_load_time = page_load_times.get("average", 0)
        if avg_load_time > 5:  # More than 5 seconds
            analysis["page_load_score"] = "poor"
        elif avg_load_time > 3:  # More than 3 seconds
            analysis["page_load_score"] = "needs_improvement"
    
    return analysis

def _analyze_mobile_app_health(mobile_metrics: Dict) -> Dict[str, Any]:
    """Analyze mobile app health metrics."""
    analysis = {
        "crash_rate_score": "good",
        "launch_time_score": "good",
        "network_score": "good",
        "overall_health": "good"
    }
    
    # Crash rate analysis
    crash_rate = mobile_metrics.get("crash_rate", {})
    if crash_rate:
        avg_crash_rate = crash_rate.get("average", 0)
        if avg_crash_rate > 2:  # More than 2%
            analysis["crash_rate_score"] = "poor"
        elif avg_crash_rate > 1:  # More than 1%
            analysis["crash_rate_score"] = "needs_improvement"
    
    # App launch time analysis
    launch_time = mobile_metrics.get("app_launch_time", {})
    if launch_time:
        avg_launch_time = launch_time.get("average", 0)
        if avg_launch_time > 5:  # More than 5 seconds
            analysis["launch_time_score"] = "poor"
        elif avg_launch_time > 3:  # More than 3 seconds
            analysis["launch_time_score"] = "needs_improvement"
    
    # Network error analysis
    network_errors = mobile_metrics.get("network_errors", {})
    if network_errors:
        error_count = network_errors.get("count", 0)
        if error_count > 100:  # More than 100 errors
            analysis["network_score"] = "poor"
        elif error_count > 50:  # More than 50 errors
            analysis["network_score"] = "needs_improvement"
    
    return analysis

def _generate_web_vitals_recommendations(analysis: Dict) -> List[str]:
    """Generate recommendations based on web vitals analysis."""
    recommendations = []
    
    if analysis["lcp_score"] != "good":
        recommendations.append("Optimize Largest Contentful Paint (LCP) by improving server response times and optimizing images.")
    
    if analysis["fid_score"] != "good":
        recommendations.append("Improve First Input Delay (FID) by reducing JavaScript execution time and optimizing third-party scripts.")
    
    if analysis["cls_score"] != "good":
        recommendations.append("Reduce Cumulative Layout Shift (CLS) by setting size attributes on images and avoiding dynamic content insertion.")
    
    if analysis["overall_score"] == "good":
        recommendations.append("Web vitals are performing well. Continue monitoring for any degradation.")
    
    return recommendations

def _generate_journey_recommendations(analysis: Dict) -> List[str]:
    """Generate recommendations based on user journey analysis."""
    recommendations = []
    
    if analysis["bounce_rate_score"] != "good":
        recommendations.append("High bounce rate detected. Improve page content relevance and user experience.")
    
    if analysis["session_duration_score"] != "good":
        recommendations.append("Short session durations indicate poor engagement. Enhance content quality and user experience.")
    
    if analysis["page_load_score"] != "good":
        recommendations.append("Slow page load times detected. Optimize images, scripts, and server response times.")
    
    return recommendations

def _generate_mobile_health_recommendations(analysis: Dict) -> List[str]:
    """Generate recommendations based on mobile app health analysis."""
    recommendations = []
    
    if analysis["crash_rate_score"] != "good":
        recommendations.append("High crash rate detected. Review error logs and implement better error handling.")
    
    if analysis["launch_time_score"] != "good":
        recommendations.append("Slow app launch times detected. Optimize app initialization and reduce startup dependencies.")
    
    if analysis["network_score"] != "good":
        recommendations.append("High network error rate detected. Implement retry logic and improve network error handling.")
    
    return recommendations

def _calculate_overall_health_score(web_vitals: Dict, journey: Dict, mobile: Dict) -> str:
    """Calculate overall health score based on all analyses."""
    scores = []
    
    if web_vitals.get("data", {}).get("performance_analysis", {}).get("overall_score"):
        scores.append(web_vitals["data"]["performance_analysis"]["overall_score"])
    
    if journey.get("data", {}).get("performance_analysis", {}).get("overall_engagement"):
        scores.append(journey["data"]["performance_analysis"]["overall_engagement"])
    
    if mobile.get("data", {}).get("health_analysis", {}).get("overall_health"):
        scores.append(mobile["data"]["health_analysis"]["overall_health"])
    
    if not scores:
        return "unknown"
    
    if "poor" in scores:
        return "poor"
    elif "needs_improvement" in scores:
        return "needs_improvement"
    else:
        return "good"

def _identify_critical_issues(web_vitals: Dict, journey: Dict, mobile: Dict) -> List[str]:
    """Identify critical issues across all analyses."""
    issues = []
    
    # Check for critical web vitals issues
    if web_vitals.get("data", {}).get("performance_analysis", {}).get("overall_score") == "poor":
        issues.append("Critical web vitals performance issues detected")
    
    # Check for critical user journey issues
    if journey.get("data", {}).get("performance_analysis", {}).get("overall_engagement") == "poor":
        issues.append("Critical user engagement issues detected")
    
    # Check for critical mobile app issues
    if mobile.get("data", {}).get("health_analysis", {}).get("overall_health") == "poor":
        issues.append("Critical mobile app health issues detected")
    
    return issues
