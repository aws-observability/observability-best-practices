# Contributing to AWS Observability Best Practices MCP Server

We welcome contributions to the AWS Observability Best Practices MCP Server! This document provides guidelines for contributing to the project.

##  How to Contribute

### Reporting Issues

1. **Search existing issues** first to avoid duplicates
2. **Use the issue template** when creating new issues
3. **Provide detailed information** including:
   - AWS region and services affected
   - Error messages and logs
   - Steps to reproduce
   - Expected vs actual behavior

### Suggesting Features

1. **Check existing feature requests** to avoid duplicates
2. **Describe the use case** and business value
3. **Provide implementation ideas** if you have them
4. **Consider backward compatibility**

### Code Contributions

#### Prerequisites

- Python 3.11 or higher
- AWS CLI configured with test credentials
- Familiarity with MCP (Model Context Protocol)
- Understanding of AWS cost optimization concepts

#### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/aws-observability/observability-best-practices.git
   cd observability-best-practices
   ```

2. **Create a virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   pip install -r requirements_dev.txt  # If available
   ```

4. **Run tests**
   ```bash
   python3 test_runbooks.py
   ```

#### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code style and patterns
   - Add docstrings to new functions
   - Include error handling
   - Update documentation as needed

3. **Test your changes**
   ```bash
   # Run integration tests
   python3 test_runbooks.py
   
   # Test specific functionality
   python3 -c "from runbook_functions import your_function; print('OK')"
   
   # Test with Amazon Q (if possible)
   q chat
   ```

4. **Update documentation**
   - Update README.md if needed
   - Update RUNBOOKS_GUIDE.md for new features
   - Add examples for new tools

#### Code Style Guidelines

- **Follow PEP 8** Python style guidelines
- **Use descriptive variable names**
- **Add type hints** where appropriate
- **Include docstrings** for all functions
- **Handle errors gracefully** with informative messages
- **Use async/await** for MCP tool functions

#### Example Code Structure

```python
async def your_new_tool(arguments: Dict[str, Any]) -> List[TextContent]:
    """
    Brief description of what the tool does.
    
    Args:
        arguments: Dictionary containing tool parameters
        
    Returns:
        List of TextContent with results
    """
    try:
        # Validate inputs
        region = arguments.get("region")
        if not region:
            return [TextContent(type="text", text="Error: region parameter is required")]
        
        # Create AWS client
        client = boto3.client('service-name', region_name=region)
        
        # Make API calls
        response = client.some_api_call()
        
        # Process results
        result = {
            "status": "success",
            "data": response,
            "message": "Operation completed successfully"
        }
        
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except ClientError as e:
        error_msg = f"AWS API Error: {e.response['Error']['Code']} - {e.response['Error']['Message']}"
        return [TextContent(type="text", text=f"Error: {error_msg}")]
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]
```

#### Adding New Tools

1. **Add tool definition** to `list_tools()` in `mcp_server_with_runbooks.py`
2. **Add tool handler** to `call_tool()` function
3. **Implement tool function** in `runbook_functions.py`
4. **Add tests** for the new functionality
5. **Update documentation**

#### Submitting Changes

1. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new cost optimization tool for XYZ"
   ```

2. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request**
   - Use a descriptive title
   - Explain what the PR does and why
   - Reference any related issues
   - Include testing instructions

##  Pull Request Guidelines

### PR Title Format
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `refactor:` for code refactoring
- `test:` for test additions/changes

### PR Description Should Include
- **What** the PR does
- **Why** the change is needed
- **How** to test the changes
- **Screenshots** if UI changes are involved
- **Breaking changes** if any

### Review Process
1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** in different environments
4. **Documentation** review if applicable

##  Testing Guidelines

### Integration Tests
- All existing tests must pass
- Add tests for new functionality
- Test with real AWS resources when possible
- Include error case testing

### Manual Testing
- Test with Amazon Q CLI
- Verify tool responses are properly formatted
- Check error handling with invalid inputs
- Test in different AWS regions

##  Documentation Standards

### Code Documentation
- **Docstrings** for all public functions
- **Inline comments** for complex logic
- **Type hints** for function parameters and returns

### User Documentation
- **Clear examples** for new tools
- **Parameter descriptions** with types and defaults
- **Error scenarios** and troubleshooting tips
- **Use cases** and expected outcomes

## Release Process

1. **Version bumping** follows semantic versioning
2. **Changelog** is updated with new features and fixes
3. **Documentation** is updated for new releases
4. **Testing** is performed across different environments

## Getting Help

- **GitHub Issues** for bugs and feature requests
- **GitHub Discussions** for questions and ideas
- **Documentation** for usage guidelines
- **Code comments** for implementation details

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow the project's coding standards

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributor graphs

Thank you for contributing to AWS Observability Best Practices MCP Server!
