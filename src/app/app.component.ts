import { Component, OnInit } from '@angular/core';
import { detectIncognito } from "detectincognitojs";
import { ClientJS } from 'clientjs';

import { SharedService } from './shared.service';

// import { MaliceDetect }  from './utils/malicedetect';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  incognitoResult: any
  fraudSummary = {
    fingerprint: 0,
    ip_address: '',
    incognito: false,
    user_agent: null,
    browser: {
      name: '',
      version: '',
    },
    timezone: '',
    language: '',
    max_touch_points: 0,
    plugins: '',

    os: {
      name: '',
      version: '',
    },
    geolocation: '',
    device: {
      type: '',
      vendor: '',
      name: '',
    },
    mobile: null,
    is_bot: false,
  }

  constructor(private sharedService: SharedService) {

  }

  ngOnInit(): void {
    // const maliceDetect = new MaliceDetect((result) => {
    //   console.log(result);
    // });
    
    // maliceDetect.init();
    this.sharedService.getIPAddress().subscribe(result => {
      this.fraudSummary.ip_address = result.ip;
    })

    detectIncognito().then((result) => {
      this.incognitoResult = result;
      this.fraudSummary.incognito = result.isPrivate;
      this.fraudSummary.browser.name = result.browserName;
    });
    
    const client = new ClientJS();
    this.fraudSummary.browser.version = client.getBrowserVersion();

    this.fraudSummary.os.name = client.getOS();
    this.fraudSummary.os.version = client.getOSVersion();

    this.fraudSummary.device.name = client.getDevice();
    this.fraudSummary.device.type = client.getDeviceType();
    this.fraudSummary.device.vendor = client.getDeviceVendor();
    
    this.fraudSummary.timezone = client.getTimeZone();
    this.fraudSummary.language = client.getLanguage();
    this.fraudSummary.user_agent = client.getUserAgent();

    if (client.isMobile()) {
      this.fraudSummary['mobile'] = {
        is_mobile_major: client.isMobileMajor(),
        is_mobile_android: client.isMobileAndroid(),
        is_mobile_opera: client.isMobileOpera(),
        is_mobile_windows: client.isMobileWindows(),
        is_mobile_blackBerry: client.isMobileBlackBerry(),
        is_mobile_ios: client.isMobileIOS(),
        is_iphone: client.isIphone(),
        is_ipad: client.isIpad(),
        is_ipod: client.isIpod(),
      }
    }

    this.fraudSummary.fingerprint = client.getFingerprint();
    this.fraudSummary.plugins = client.getPlugins();
    this.fraudSummary.max_touch_points = navigator.maxTouchPoints;
    this.fraudSummary.is_bot = /bot|crawler|spider|crawling/i.test(navigator.userAgent);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition)
    }

  }

  showPosition(position: any) {
    console.log(position)
  }
}
