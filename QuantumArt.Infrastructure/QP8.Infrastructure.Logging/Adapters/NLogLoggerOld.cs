﻿using System;
using System.Collections.Generic;
using NLog;
using QP8.Infrastructure.Logging.Interfaces;
using LogManager = NLog.LogManager;

namespace QP8.Infrastructure.Logging.Adapters
{
    /// <summary>
    /// Wrapper over the NLog 2.0 beta and above logger
    /// </summary>
    public class NLogLoggerOld : ILog
    {
        protected readonly NLog.Logger Logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="NLogLogger"/> class
        /// </summary>
        /// <param name="loggerName">The string based logger name</param>
        public NLogLoggerOld(string loggerName)
        {
            Logger = LogManager.GetLogger(loggerName);
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="NLogLogger"/> class
        /// </summary>
        /// <param name="type">The type on which logger name is based</param>
        public NLogLoggerOld(Type type)
        {
            Logger = LogManager.GetLogger(UseFullTypeNames ? type.FullName : type.Name);
        }

        public static bool UseFullTypeNames { get; set; } = true;

        public string LoggerName => Logger.Name;

        public bool IsTraceEnabled => Logger.IsTraceEnabled;

        public bool IsDebugEnabled => Logger.IsDebugEnabled;

        public bool IsInfoEnabled => Logger.IsInfoEnabled;

        public bool IsWarnEnabled => Logger.IsWarnEnabled;

        public bool IsErrorEnabled => Logger.IsErrorEnabled;

        public bool IsFatalEnabled => Logger.IsFatalEnabled;

        public void Trace(object message)
        {
            if (IsTraceEnabled)
            {
                Log(LogLevel.Trace, message?.ToString());
            }
        }

        public void Trace(object message, Exception exception)
        {
            if (IsTraceEnabled)
            {
                Log(LogLevel.Trace, message?.ToString(), exception);
            }
        }

        public void Trace(object message, IEnumerable<Exception> exceptions)
        {
            if (IsTraceEnabled)
            {
                Log(LogLevel.Trace, message?.ToString(), new AggregateException(exceptions));
            }
        }

        public void TraceFormat(string format, params object[] args)
        {
            if (IsTraceEnabled)
            {
                Log(LogLevel.Trace, format, args);
            }
        }

        public void Debug(object message)
        {
            if (IsDebugEnabled)
            {
                Log(LogLevel.Debug, message?.ToString());
            }
        }

        public void Debug(object message, Exception exception)
        {
            if (IsDebugEnabled)
            {
                Log(LogLevel.Debug, message?.ToString(), exception);
            }
        }

        public void Debug(object message, IEnumerable<Exception> exceptions)
        {
            if (IsDebugEnabled)
            {
                Log(LogLevel.Debug, message?.ToString(), new AggregateException(exceptions));
            }
        }

        public void DebugFormat(string format, params object[] args)
        {
            if (IsDebugEnabled)
            {
                Log(LogLevel.Debug, format, args);
            }
        }

        public void Info(object message)
        {
            if (IsInfoEnabled)
            {
                Log(LogLevel.Info, message?.ToString());
            }
        }

        public void Info(object message, Exception exception)
        {
            if (IsInfoEnabled)
            {
                Log(LogLevel.Info, message?.ToString(), exception);
            }
        }

        public void Info(object message, IEnumerable<Exception> exceptions)
        {
            if (IsInfoEnabled)
            {
                Log(LogLevel.Info, message?.ToString(), new AggregateException(exceptions));
            }
        }

        public void InfoFormat(string format, params object[] args)
        {
            if (IsInfoEnabled)
            {
                Log(LogLevel.Info, format, args);
            }
        }

        public void Warn(object message)
        {
            if (IsWarnEnabled)
            {
                Log(LogLevel.Warn, message?.ToString());
            }
        }

        public void Warn(object message, Exception exception)
        {
            if (IsWarnEnabled)
            {
                Log(LogLevel.Warn, message?.ToString(), exception);
            }
        }

        public void Warn(object message, IEnumerable<Exception> exceptions)
        {
            if (IsWarnEnabled)
            {
                Log(LogLevel.Warn, message?.ToString(), new AggregateException(exceptions));
            }
        }

        public void WarnFormat(string format, params object[] args)
        {
            if (IsWarnEnabled)
            {
                Log(LogLevel.Warn, format, args);
            }
        }

        public void Error(object message)
        {
            if (IsErrorEnabled)
            {
                Log(LogLevel.Error, message?.ToString());
            }
        }

        public void Error(object message, Exception exception)
        {
            if (IsErrorEnabled)
            {
                Log(LogLevel.Error, message?.ToString(), exception);
            }
        }

        public void Error(object message, IEnumerable<Exception> exceptions)
        {
            if (IsErrorEnabled)
            {
                Log(LogLevel.Error, message?.ToString(), new AggregateException(exceptions));
            }
        }

        public void ErrorFormat(string format, params object[] args)
        {
            if (IsErrorEnabled)
            {
                Log(LogLevel.Error, format, args);
            }
        }

        public void Fatal(object message)
        {
            if (IsFatalEnabled)
            {
                Log(LogLevel.Fatal, message?.ToString());
            }
        }

        public void Fatal(object message, Exception exception)
        {
            if (IsFatalEnabled)
            {
                Log(LogLevel.Fatal, message?.ToString(), exception);
            }
        }

        public void Fatal(object message, IEnumerable<Exception> exceptions)
        {
            if (IsFatalEnabled)
            {
                Log(LogLevel.Fatal, message?.ToString(), new AggregateException(exceptions));
            }
        }

        public void FatalFormat(string format, params object[] args)
        {
            if (IsFatalEnabled)
            {
                Log(LogLevel.Fatal, format, args);
            }
        }

        public void Log(LogEventInfo logEventInfo)
        {
            Logger.Log(typeof(NLogLogger), logEventInfo);
        }

        public void Log(LogLevel logLevel, string message, Exception ex)
        {
            Log(new LogEventInfo(logLevel, Logger.Name, null, message, null, ex));
        }

        public void Log(LogLevel logLevel, string format, params object[] args)
        {
            Log(new LogEventInfo(logLevel, Logger.Name, null, format, args));
        }

        public void Log(LogLevel logLevel, string format, object[] args, Exception ex)
        {
            Log(new LogEventInfo(logLevel, Logger.Name, null, format, args, ex));
        }

        public void SetContext(string item, string value)
        {
            MappedDiagnosticsContext.Set(item, value);
        }

        public void SetContext(string item, object value)
        {
            MappedDiagnosticsContext.Set(item, value);
        }

        public void SetAsyncContext(string item, string value)
        {
            MappedDiagnosticsLogicalContext.Set(item, value);
        }

        public void SetAsyncContext(string item, object value)
        {
            MappedDiagnosticsLogicalContext.Set(item, value);
        }

        public void SetGlobalContext(string item, string value)
        {
            GlobalDiagnosticsContext.Set(item, value);
        }

        public void SetGlobalContext(string item, object value)
        {
            GlobalDiagnosticsContext.Set(item, value);
        }

        public void Flush()
        {
            LogManager.Flush();
        }

        public void Shutdown()
        {
            LogManager.Shutdown();
        }

        public void Dispose()
        {
            Flush();
            Shutdown();
        }
    }
}
