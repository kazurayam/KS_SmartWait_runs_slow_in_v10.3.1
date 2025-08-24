import com.kms.katalon.core.testobject.ConditionType
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

TestObject makeTestObject(String id, String xpath) {
	TestObject tObj = new TestObject(id)
	tObj.addProperty("xpath", ConditionType.EQUALS, xpath)
	return tObj	
}

String url = "https://kazurayam.github.io/KS_SmartWait_runs_slow_in_v10.3.1/timing.html"

WebUI.openBrowser("")
WebUI.setViewPortSize(800, 600)
WebUI.navigateToUrl(url)

WebUI.waitForElementPresent(makeTestObject("fizzbuzz", "//*/div[contains(.,'FizzBuzz')]"), 20)

WebUI.click(makeTestObject("STOP BUTTON", "#btn"))

WebUI.delay(1)
WebUI.closeBrowser()
