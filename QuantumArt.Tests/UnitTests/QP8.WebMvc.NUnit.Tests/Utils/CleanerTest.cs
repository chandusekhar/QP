using NUnit.Framework;
using Quantumart.QP8.Constants;
using Quantumart.QP8.Utils;

namespace QP8.WebMvc.NUnit.Tests.Utils
{
    [TestFixture]
    public class CleanerTest
    {
        [Test]
        public void ToSafeSqlLikeCondition_NullInput_NullResult()
        {
            Assert.IsNull(Cleaner.ToSafeSqlLikeCondition(DatabaseType.SqlServer, null));
        }

        [Test]
        public void ToSafeSqlLikeCondition_SafeInput_SafeResult()
        {
            Assert.AreEqual("test", Cleaner.ToSafeSqlLikeCondition(DatabaseType.SqlServer,"test"));
        }

        [Test]
        public void ToSafeSqlLikeCondition_UnsafeInput_SafeResult()
        {
            Assert.AreEqual("'' [[] [%] [_]", Cleaner.ToSafeSqlLikeCondition(DatabaseType.SqlServer,"' [ % _"));
        }

        [Test]
        public void ToSafeSqlLikeConditionPg_UnsafeInput_SafeResult()
        {
            Assert.AreEqual(@"'' [ \% \_", Cleaner.ToSafeSqlLikeCondition(DatabaseType.Postgres,"' [ % _"));
        }

        [Test]
        public void ToSafeSqlString_NullInput_NullResult()
        {
            Assert.IsNull(Cleaner.ToSafeSqlString(null));
        }

        [Test]
        public void ToSafeSqlString_SafeInput_SafeResult()
        {
            Assert.AreEqual("test", Cleaner.ToSafeSqlString("test"));
        }

        [Test]
        public void ToSafeSqlString_UnsafeInput_SafeResult()
        {
            Assert.AreEqual("''test''", Cleaner.ToSafeSqlString("'test'"));
        }
    }
}
