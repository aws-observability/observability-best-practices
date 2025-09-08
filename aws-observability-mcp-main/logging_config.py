"""
Centralized logging configuration for AWS Observability Best Practices MCP Server
"""

import logging
import sys
import os
import tempfile
from datetime import datetime

def setup_logging():
    """Configure comprehensive logging for the application."""
    
    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s'
    )
    
    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    
    # Remove existing handlers
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)
    
    # Always add console handler first (this will always work)
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)
    root_logger.addHandler(console_handler)
    
    # Try to add file handlers, but don't fail if we can't write files
    try:
        # Try to create logs directory if it doesn't exist
        log_dir = 'logs'
        if not os.path.exists(log_dir):
            os.makedirs(log_dir, exist_ok=True)
        
        # Try main log file in logs directory first
        log_file = os.path.join(log_dir, 'aws_observability_best_practices_mcp.log')
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(logging.INFO)
        file_handler.setFormatter(formatter)
        root_logger.addHandler(file_handler)
        
        # Try error log file
        error_file = os.path.join(log_dir, 'aws_observability_best_practices_mcp_errors.log')
        error_handler = logging.FileHandler(error_file)
        error_handler.setLevel(logging.ERROR)
        error_handler.setFormatter(formatter)
        root_logger.addHandler(error_handler)
        
    except (OSError, PermissionError) as e:
        # If we can't write to logs directory, try current directory
        try:
            file_handler = logging.FileHandler('aws_observability_best_practices_mcp.log')
            file_handler.setLevel(logging.INFO)
            file_handler.setFormatter(formatter)
            root_logger.addHandler(file_handler)
            
            error_handler = logging.FileHandler('aws_observability_best_practices_mcp_errors.log')
            error_handler.setLevel(logging.ERROR)
            error_handler.setFormatter(formatter)
            root_logger.addHandler(error_handler)
            
        except (OSError, PermissionError):
            # If we can't write anywhere, try temp directory
            try:
                temp_dir = tempfile.gettempdir()
                temp_log = os.path.join(temp_dir, 'aws_observability_best_practices_mcp.log')
                file_handler = logging.FileHandler(temp_log)
                file_handler.setLevel(logging.INFO)
                file_handler.setFormatter(formatter)
                root_logger.addHandler(file_handler)
                
                temp_error = os.path.join(temp_dir, 'aws_observability_best_practices_mcp_errors.log')
                error_handler = logging.FileHandler(temp_error)
                error_handler.setLevel(logging.ERROR)
                error_handler.setFormatter(formatter)
                root_logger.addHandler(error_handler)
                
                # Log where we're writing files
                print(f"Warning: Using temp directory for logs: {temp_dir}")
                
            except (OSError, PermissionError):
                # If all else fails, just use console logging
                print("Warning: Could not create log files, using console logging only")
    
    return logging.getLogger(__name__)

def log_function_entry(logger, func_name, **kwargs):
    """Log function entry with parameters."""
    logger.info(f"Entering {func_name} with params: {kwargs}")

def log_function_exit(logger, func_name, result_status=None, execution_time=None):
    """Log function exit with results."""
    msg = f"Exiting {func_name}"
    if result_status:
        msg += f" - Status: {result_status}"
    if execution_time:
        msg += f" - Time: {execution_time:.2f}s"
    logger.info(msg)

def log_aws_api_call(logger, service, operation, **params):
    """Log AWS API calls."""
    logger.info(f"AWS API Call: {service}.{operation} with params: {params}")

def log_aws_api_error(logger, service, operation, error):
    """Log AWS API errors."""
    logger.error(f"AWS API Error: {service}.{operation} - {str(error)}")