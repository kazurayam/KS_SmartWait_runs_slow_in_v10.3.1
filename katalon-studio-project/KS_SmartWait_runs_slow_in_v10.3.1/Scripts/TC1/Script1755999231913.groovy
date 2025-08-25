import com.kms.katalon.core.testobject.ConditionType
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import my.TestObjectFactory

String url = "https://kazurayam.github.io/KS_SmartWait_runs_slow_in_v10.3.1/fizzbuzz.html"

WebUI.openBrowser("")
WebUI.setViewPortSize(800, 600)
WebUI.navigateToUrl(url)

WebUI.waitForElementPresent(TestObjectFactory.makeTestObject("fizzbuzz", "//*/div[contains(.,'FizzBuzz')]"), 20)

WebUI.click(TestObjectFactory.makeTestObject("STOP BUTTON", "//*/input[@id='btn']"))
WebUI.delay(1)

WebUI.closeBrowser()
