if (window === window.top && (typeof window.katalonWaiter == "undefined")) {
  const KatalonWaiter = function () {
    this.domModifiedTime = "";
    this.ajaxObjects = [];
  };

  KatalonWaiter.prototype.katalon_smart_waiter_do_dom_wait = function (
    callback,
    timeoutInMillis
  ) {
    if (timeoutInMillis === undefined || timeoutInMillis === null) {
      timeoutInMillis = 30000; // Default timeout is 30 seconds
    }
    var domCount = 0;
    var domTime = "";
    function katalon_smart_waiter_do_dom_wait() {
      setTimeout(() => {
        if (domTime && (Date.now() - domTime > timeoutInMillis)) {
          domTime = "";
          callback(true);
        } else if (
          window.katalonWaiter.domModifiedTime &&
          (Date.now() - window.katalonWaiter.domModifiedTime < 400)
        ) {
          domCount++;
          if (domCount === 1) {
            domTime = Date.now();
          }
          return katalon_smart_waiter_do_dom_wait();
        } else {
          domTime = "";
          callback(true);
        }
      }, 100);
    }
    return katalon_smart_waiter_do_dom_wait();
  };

  KatalonWaiter.prototype.katalon_smart_waiter_do_ajax_wait = function (
  	callback,
  	timeoutInMillis
  ) {
    if (timeoutInMillis === undefined || timeoutInMillis === null) {
      timeoutInMillis = 30000; // Default timeout is 30 seconds
    }
    var ajaxCount = 0;
    var ajaxTime = "";

    function notServerSentEvent(ajaxObject) {
      var contentType = ajaxObject.getResponseHeader("Content-Type");
      return !(contentType && contentType.includes('text/event-stream'));
    }

    function katalon_smart_waiter_do_ajax_wait() {
      function isAjaxDone() {
        if (window.katalonWaiter.ajaxObjects) {
          if (window.katalonWaiter.ajaxObjects.length === 0) {
            return true;
          } else {
            for (var index in window.katalonWaiter.ajaxObjects) {
              var requestI = window.katalonWaiter.ajaxObjects[index];
              var isPromise = requestI instanceof Promise;
              if (isPromise) {
                if (!requestI.isFulfilled) {
                  return false;
                }
              } else {
                if ((requestI.readyState) !== 4
                  && (requestI.readyState) !== undefined
                  && (requestI.readyState) !== 0
				  && notServerSentEvent(requestI)) {
				  	return false;
                }
              }
            }
            return true;
          }
        } else {
          if (window.katalonOriginXMLHttpRequest) {
            window.katalonOriginXMLHttpRequest = "";
          }
          return true;
        }
      }

      setTimeout(() => {
        if (ajaxTime && (Date.now() - ajaxTime > timeoutInMillis)) {
          ajaxCount = 0;
          ajaxTime = "";
          callback(true);
        } else if (isAjaxDone()) {
          ajaxCount = 0;
          ajaxTime = "";
          callback(true);
        } else {
          ajaxCount++;
          if (ajaxCount === 1) {
            ajaxTime = Date.now();
          }
          return katalon_smart_waiter_do_ajax_wait();
        }
      }, 100);
    }

    return katalon_smart_waiter_do_ajax_wait();
  };

  (function katalon_smart_waiter_do_prewait() {
    window.katalonWaiter = new KatalonWaiter();
    console.log("content script: Katalon Waiter v.2 is up and running !");
    var document = window.document;
    function katalon_smart_waiter_setDOMModifiedTime() {
      window.katalonWaiter.domModifiedTime = Date.now();
    }

    const observer = new MutationObserver(mutationList =>
      mutationList.filter(m => m.type === 'childList').forEach(m => {
        m.addedNodes.forEach(katalon_smart_waiter_setDOMModifiedTime);
      }));
    observer.observe(document, { childList: true, subtree: true });

    document.addEventListener(
      "DOMContentLoaded",
      katalon_smart_waiter_setDOMModifiedTime,
      false
    );
    if (window.XMLHttpRequest) {
      if (!window.katalonOriginXMLHttpRequest || !window.katalonWaiter.ajaxObjects) {
        window.katalonWaiter.ajaxObjects = [];
        window.katalonOriginXMLHttpRequest = window.XMLHttpRequest;
        window.XMLHttpRequest = function () {
          var xhr = new window.katalonOriginXMLHttpRequest();
          window.katalonWaiter.ajaxObjects.push(xhr);
          return xhr;
        };
        // Restore properties
        for (var key of Object.keys(window.katalonOriginXMLHttpRequest)) {
          window.XMLHttpRequest[key] = window.katalonOriginXMLHttpRequest[key];
        }
        window.XMLHttpRequest.prototype = window.katalonOriginXMLHttpRequest.prototype;
      }
    }

    if (window.fetch) {
      const nativeFetch = window.fetch;

      window.fetch = new Proxy(nativeFetch, {
        apply: function (target, thisArg, args) {

          var fetchPromise = Reflect.apply(target, thisArg, args);
          fetchPromise.finally((res) => {
            fetchPromise.isFulfilled = true;
            return res;
          });
          window.katalonWaiter.ajaxObjects.push(fetchPromise);
          return fetchPromise;
        }
      });
    }
  })();
}
