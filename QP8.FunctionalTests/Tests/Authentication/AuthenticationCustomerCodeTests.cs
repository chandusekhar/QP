﻿using AllureCSharpCommons.AllureModel;
using AllureCSharpCommons.Attributes;
using Nunit3AllureAdapter;
using NUnit.Framework;
using QP8.FunctionalTests.Configuration;
using QP8.FunctionalTests.PageObjects.Pages.Authentication;
using QP8.FunctionalTests.TestsData.Authentication;

namespace QP8.FunctionalTests.Tests.Authentication
{
    [AllureStories(Story)]
    [Parallelizable(ParallelScope.Fixtures)]
    public class AuthenticationCustomerCodeTests : AuthenticationTests
    {
        private const string Story = "Customer code";

        [SetUp]
        public void LocalSetUp()
        {
            if (Config.Tests.BackendCustomerCodeFieldIsDropdown)
                Assert.Ignore("Test ingnored");
        }

        [AllureTest]
        [AllureSeverity(severitylevel.normal)]
        [AllureTitle("Authentication with invalid customer code")]
        [AllureDescription("Invalid customer code", descriptiontype.html)]
        [TestCaseSource(typeof(AuthenticationTestsData), "InvalidCustomerCode")]
        public void InvalidCustomerCodeTest(string customerCode)
        {
            var page = new AuthenticationPage(Driver);

            AuthenticationSteps(page, Config.Tests.BackendLogin, Config.Tests.BackendPassword, customerCode);
            CheckValidationSteps(page, page.CustomerCodeInput, "Customer code", "Customer code does not exist!");
            CheckJavaScriptErrors();
        }
    }
}
