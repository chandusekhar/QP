using System;

namespace Quantumart.QP8.DAL
{
    public class SqlQuerySyntaxHelper
    {
        public static string CastToString(DatabaseType databaseType, string columnName)
        {
            switch (databaseType)
            {
                case DatabaseType.SqlServer:
                    return $"CAST({columnName} as nvarchar)";
                case DatabaseType.Postgres:
                    return $"{columnName}::varchar";
                default:
                    throw new ArgumentOutOfRangeException(nameof(databaseType), databaseType, null);
            }
        }

        public static string ToBoolSql(DatabaseType databaseType, bool boolValue)
        {
            switch (databaseType)
            {
                case DatabaseType.SqlServer:
                    return boolValue ? "cast(1 as bit)" : "cast(0 as bit)";
                case DatabaseType.Postgres:
                    return boolValue ? "TRUE" : "FALSE";
                default:
                    throw new ArgumentOutOfRangeException(nameof(databaseType), databaseType, null);
            }
        }

        public static string CastToBool(DatabaseType databaseType, string expression)
        {
            switch (databaseType)
            {
                case DatabaseType.SqlServer:
                    return $"cast({expression} as bit)";
                case DatabaseType.Postgres:
                    return $"(({expression})::int::boolean)";
                default:
                    throw new ArgumentOutOfRangeException(nameof(databaseType), databaseType, null);
            }
        }

        public static string CastToVarchar(DatabaseType databaseType, string expression)
        {
            switch (databaseType)
            {
                case DatabaseType.SqlServer:
                    return $"cast({expression} as nvarchar)";
                case DatabaseType.Postgres:
                    return $"cast({expression} as varchar)";
                default:
                    throw new ArgumentOutOfRangeException(nameof(databaseType), databaseType, null);
            }
        }



        public static string NullableDbValue(DatabaseType databaseType, int? value)
        {
            switch (databaseType)
            {
                case DatabaseType.SqlServer:
                    return value.HasValue ? value.ToString() : "NULL";
                case DatabaseType.Postgres:
                    return value.HasValue ? value.ToString() : "NULL::numeric";
                default:
                    throw new ArgumentOutOfRangeException(nameof(databaseType), databaseType, null);
            }
        }

        public static string ConcatStrValuesSql(DatabaseType databaseType, params string[] p)
        {
            switch (databaseType)
            {
                case DatabaseType.SqlServer:
                    return string.Join(" + ", p);
                case DatabaseType.Postgres:
                    return string.Join(" || ", p);
                default:
                    throw new ArgumentOutOfRangeException(nameof(databaseType), databaseType, null);
            }
        }

        public static string EscapeEntityName(DatabaseType databaseType, string entityName)
        {
            switch (databaseType)
            {
                case DatabaseType.SqlServer:
                    return $"[{entityName}]";
                case DatabaseType.Postgres:
                    return $"\"{entityName.ToLower()}\"";
                default:
                    throw new ArgumentOutOfRangeException(nameof(databaseType), databaseType, null);
            }
        }
    }
}
