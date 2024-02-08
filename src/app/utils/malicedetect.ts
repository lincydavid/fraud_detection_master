interface MaliceDetectResult {
  status: 'passed' | 'failed';
}

export class MaliceDetect {
  private eva: Function;

  constructor(private callback: (result: MaliceDetectResult) => void) {
    this.eva = eval;
  }

  private check(): void {
    if (
      this.checkUA() ||
      this.checkPrototype() ||
      this.checkVars() ||
      this.checkLanguages() ||
      this.checkScreen()
    ) {
      this.callback({ status: 'failed' });
    } else {
      this.callback({ status: 'passed' });
    }
  }

  private checkPrototype(): boolean {
    const n = navigator;
    try {
      if (
        (PluginArray.prototype as any) === (n.plugins as any).__proto__ === false ||
        (Plugin.prototype as any) === (n.plugins[0] as any).__proto__ === false ||
        (MimeTypeArray.prototype as any) === (n.mimeTypes as any).__proto__ === false ||
        (MimeType.prototype as any) === (n.mimeTypes[0] as any).__proto__ === false
      ) {
        return true;
      }
    } catch (e) {}
    return false;
  }

  private checkVars(): boolean {
    const w = window,
      d = document,
      n = navigator,
      e = d.documentElement,
      windowBotVars = ['webdriver', '_Selenium_IDE_Recorder', 'callSelenium', '_selenium', 'callPhantom', '_phantom', 'phantom', '__nightmare'],
      navigatorBotVars = ['webdriver', '__webdriver_script_fn', '__driver_evaluate', '__webdriver_evaluate', '__selenium_evaluate', '__fxdriver_evaluate', '__driver_unwrapped', '__webdriver_unwrapped', '__selenium_evaluate', '__fxdriver_evaluate', '__driver_unwrapped', '__webdriver_unwrapped', '__selenium_unwrapped', '__fxdriver_unwrapped', '__webdriver_script_func'],
      documentBotAttributes = ['webdriver', 'selenium', 'driver'];

    for (let i = 0; i < windowBotVars.length; i++)
      if (windowBotVars[i] in w) return true;

    for (let i = 0; i < navigatorBotVars.length; i++)
      if (navigatorBotVars[i] in n) return true;

    for (let i = 0; i < documentBotAttributes.length; i++)
      if (e.getAttribute(documentBotAttributes[i]) !== null) return true;

    return false;
  }

  private checkRTT(): boolean {
    const connection = (navigator as any).connection;
    const connectionRtt = connection ? connection.rtt : -1;
    return connectionRtt === 0;
  }

  private checkLanguages(): boolean {
    if (this.isIE()) return false;

    const n = navigator;

    try {
      const language = n.language;
      const languagesLength = n.languages.length;

      if (!language || languagesLength === 0) return true;
    } catch (e) {}

    return false;
  }

  private checkPlugins(): boolean {
    if (this.isIE() || this.isFirefox()) return false;

    const n = navigator;

    if (!n.plugins) return false;

    return n.plugins.length === 0;
  }

  private checkScreen(): boolean {
    const w = window;

    return w.outerWidth == 0 && w.outerHeight == 0;
  }

  private checkUA(): boolean {
    const n = navigator;
    const u = n.userAgent;

    if (u.substr(0, 11) !== 'Mozilla/5.0') return false;

    if (
      u.match(
        new RegExp(['headless', 'bot', 'crawl', 'index', 'archive', 'spider', 'http', 'google', 'bing', 'yahoo', 'msn', 'yandex', 'facebook'].join('|'), 'i')
      )
    )
      return false;

    if (u.match(new RegExp(['Mobile', 'Tablet', 'Android', 'iPhone', 'iPad', 'iPod'].join('|')))) {
      if (n.maxTouchPoints < 1 || !this.touchSupport()) return false;
    }

    if (u.match(new RegExp('Safari'))) {
      if (u.match(new RegExp('Chrome'))) {
        if (u.match(new RegExp('Edge'))) {
          return !this.isEdgeHTML() || !this.checkEdgeHTML();
        } else {
          return !this.isChrome() || !this.checkChrome();
        }
      } else if (u.match(new RegExp('Mobile Safari'))) {
        return !this.isSafari() || !this.isMobileSafari() || !this.checkSafari();
      } else {
        return !this.isSafari() || !this.checkSafari();
      }
    } else if (u.match(new RegExp('Firefox'))) {
      return !this.isIE() && !this.isChrome() && !this.isSafari() && !this.isMobileSafari() && !this.isEdgeHTML();
    }

    return true;
  }

  private reduce(e: boolean[]): number {
    return e.reduce((acc, val) => acc + (val ? 1 : 0), 0);
  }

  private isIE(): boolean {
    const w = window,
      n = navigator;
    return this.reduce(['MSCSSMatrix' in w, 'msSetImmediate' in w, 'msIndexedDB' in w, 'msMaxTouchPoints' in n, 'msPointerEnabled' in n]) >= 4;
  }

  private isChrome(): boolean {
    const w = window,
      n = navigator;
    return this.reduce([
      'webkitPersistentStorage' in n,
      'webkitTemporaryStorage' in n,
      0 === n.vendor.indexOf('Google'),
      'webkitResolveLocalFileSystemURL' in w,
      'BatteryManager' in w,
      'webkitMediaStream' in w,
      'webkitSpeechGrammar' in w
    ]) >= 5;
  }

  private isSafari(): boolean {
    const w = window,
      n = navigator;
    return this.reduce(['ApplePayError' in w, 'CSSPrimitiveValue' in w, 'Counter' in w, 'WebKitMediaKeys' in w, 0 === n.vendor.indexOf('Apple'), 'getStorageUpdates' in n]) >= 4;
  }

  private isMobileSafari(): boolean {
    const w = window,
      n = navigator;
    return this.reduce(['safari' in w, !('DeviceMotionEvent' in w), !('ongestureend' in w), !('standalone' in n)]) >= 3;
  }

  private isEdgeHTML(): boolean {
    const w = window,
      n = navigator;
    return this.reduce(['msWriteProfilerMark' in w, 'MSStream' in w, 'msLaunchUri' in n, 'msSaveBlob' in n]) >= 3 && !this.isIE();
  }

  private isFirefox(): boolean {
    return !this.isIE() && !this.isChrome() && !this.isSafari() && !this.isMobileSafari() && !this.isEdgeHTML();
  }
  private checkChrome(): boolean {
    if (this.toStringLength(this.eva) !== 33) return false;
    if (this.checkRTT()) return false;
    if (!navigator.userAgent.match(/Mobile|Tablet|Android/)) {
      if (this.checkPlugins()) return false;
    }
    return true;
  }

  private checkFirefox(): boolean {
    if (this.toStringLength(this.eva) != 37) return false;
    return true;
  }

  private checkSafari(): boolean {
    if (this.toStringLength(this.eva) != 37) return false;
    return true;
  }

  private checkMSIE(): boolean {
    if (this.toStringLength(this.eva) != 39) return false;
    return true;
  }

  private checkEdgeHTML(): boolean {
    if (this.toStringLength(this.eva) != 33) return false;
    return true;
  }

  private touchSupport(): boolean {
    const ts = 'ontouchstart' in window,
      d = document;

    if (ts) return ts;

    try {
      d.createEvent('TouchEvent');
      return true;
    } catch (r) {
      return false;
    }
  }

  private toStringLength(a: Function): number {
    return a.toString().length;
  }

  public init(): void {
    this.check();
  }
}
