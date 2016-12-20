﻿namespace Quantumart.QP8.WebMvc.Infrastructure.Enums
{
    /// <summary>
    /// Ajax result status in JSend format
    /// </summary>
    public enum JSendStatus
    {
        /// <summary>
        /// Success code
        /// </summary>
        Success,

        /// <summary>
        /// Fail code (handled exception)
        /// </summary>
        Fail,

        /// <summary>
        /// Error code (unhandled exception)
        /// </summary>
        Error
    }
}
