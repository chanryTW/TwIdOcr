# DRM Video Player Demo

使用 React 和 Shaka Player 實現的 DRM 影片播放器示範。展示了如何在網頁應用程式中實現受保護內容的播放，包括未加密內容和使用 Widevine DRM 保護的內容。

A DRM video player demonstration implemented using React and Shaka Player. It showcases how to play protected content in web applications, including both unencrypted content and content protected by Widevine DRM.

## 實際應用案例 (Real-world Applications)

[Netflix](https://www.netflix.com)

[BuyDRM MultiKey Demo](https://buydrm.com/multikey-demo/) 

## 加密效果展示 (Encryption Effect Demonstration)

### 未加密截圖 (Unencrypted Screenshot)
![未加密的影片內容](./public/clear.png)

### 加密後截圖 (Encrypted Screenshot)
![加密後的影片內容](./public/crypto.png)

## DRM (Digital Rights Management)
DRM 指的是數位版權管理 （Digital Rights Management）。DRM 的目的是保護數位化內容的版權，防止數位內容違法流出。DRM 實際上，是以保護含影片、聲音、電子書資料等數位內容版權為目的，其技術的總稱。早在媒體業界，像「版權管理」相對重要的電影發佈中使用。

  - 數位版權管理系統 (Digital Rights Management System)
  - 用於保護數位內容的技術和系統 (Technology and systems for protecting digital content)
  - 控制數位內容的使用、修改和分發 (Controls the use, modification, and distribution of digital content)

## 歷史

- 2007
    - Netflix
        - ～2010 需安裝外掛
        - ～2016 採用 eme (Widevine) 草案，只能在 chrome 上使用
- 2017
    - W3C 將 EME 正式納入 HTML 標準，成為 Web 上標準化的 DRM 解決方案（引起開源社群反彈，但仍推行）。
    - 開源社群反對 DRM，不是單純因為它是保護技術，而是因為它代表一種「限制使用者權利、破壞開放生態、依賴黑盒子」的封閉文化，與開源理念背道而馳。
    - 自由軟體基金會發起 Defective by Design
    - 主流影音服務必須用 DRM 才能保護內容授權商的利益。為了讓這些內容能在瀏覽器播放，W3C 妥協納入了 EME，否則這些服務會被迫改用原生 App，而不是用瀏覽器播放。
- 2019
    - Disney+
    - Apple TV+
- 2020
    - HBO Max
- DRM 從最早的「防拷技術」，演進為現今複雜的「數位存取權控管系統」

### DRM 系統 (DRM System)
  - 負責發放與管理影片的授權金鑰（License）
  - 不同影片、用戶、平台發不同金鑰

| DRM 名稱              | DRM Server 提供者 | 支援的播放器 / 裝置                               | 備註                 |
| ------------------- | -------------- | ----------------------------------------- | ------------------ |
| **Widevine**        | Google         | Chrome、Android、Smart TV、Chromecast、Edge   | 分為 L1 / L2 / L3 等級 |
| **PlayReady**       | Microsoft      | Edge、Windows 系統、Xbox、Smart TV（Samsung、LG） | 多用於 PC、TV、OTT 服務   |
| **FairPlay**        | Apple          | Safari、iOS、tvOS、macOS                     | 專屬於 Apple 生態系      |
| **ClearKey (CENC)** | W3C (開源)       | Chrome、Firefox、Edge                       | 測試或開放用途，無授權加密支援    |

### 加密封裝格式 (Encrypted Packaging Format)
  - DASH (.mpd) + CENC + fMP4
  - HLS (.m3u8) + AES-128 or FairPlay 加密

### 支援度判斷範例
```javascript
async function isSupportsWidevine(): Promise<boolean> {
  if (!('requestMediaKeySystemAccess' in navigator)) {
    return false;
  }

  try {
    const config = [{
      initDataTypes: ['cenc'],
      videoCapabilities: [{
        contentType: 'video/mp4; codecs="avc1.42E01E"',
      }],
    }];

    await navigator.requestMediaKeySystemAccess('com.widevine.alpha', config);
    return true;
  } catch (e) {
    return false;
  }
}

isSupportsWidevine().then((isSupported) => {
  console.log('支援 Widevine:', isSupported);
});
```

### 播放器 (Player)

| 播放器（Player）         | 支援的 DRM 類型                  | 備註                            |
| ------------------- | --------------------------- | ----------------------------- |
| **Shaka Player**    | Widevine、PlayReady、ClearKey | Google 提供的開源播放器               |
| **Dash.js**         | Widevine、PlayReady、ClearKey | MPEG-DASH 官方播放器               |
| **Video.js (配合插件)** | Widevine、PlayReady、FairPlay | 需配合 `videojs-contrib-eme` 等外掛 |
| **Bitmovin Player** | Widevine、PlayReady、FairPlay | 商用播放器，支援多 DRM                 |
| **THEOplayer**      | Widevine、PlayReady、FairPlay | 高度相容多平台，但需商業授權                |
| **JW Player (商業)**  | Widevine、PlayReady、FairPlay | 主流 OTT 廠商常用                   |
| **Safari（原生）**      | FairPlay                    | 不支援 Widevine/PlayReady        |
| **Chrome（原生）**      | Widevine                    | 內建 CDM 模組                     |
| **Edge（原生）**        | Widevine、PlayReady          | 根據平台選擇 DRM                    |
| **Firefox（原生）**     | Widevine、ClearKey           | 不支援 PlayReady、FairPlay        |

---

## CDM (Content Decryption Module)
  - 播放器內建的解密模組，與 DRM Server 配對使用。
  - 提供標準化的加密媒體處理介面
  - CDM 是無法被 JavaScript 存取的黑盒子模組

## EME (Encrypted Media Extensions)
  - W3C 標準的網頁 API
  - 使網頁應用能與 DRM/CDM 系統互動
  - 提供標準化的加密媒體處理介面

## 串流播放流程（EME 與 DRM）
```mermaid
sequenceDiagram
    participant 使用者
    participant 瀏覽器
    participant 播放器(JS)
    participant EME API（瀏覽器）
    participant CDM（瀏覽器內部模組）
    participant DRM Server

    使用者->>瀏覽器: 開啟影片頁面
    瀏覽器->>播放器(JS): 初始化播放器
    播放器(JS)->>EME API（瀏覽器）: requestMediaKeySystemAccess(DRM類型)
    EME API（瀏覽器）->>CDM（瀏覽器內部模組）: 查詢支援的 DRM
    CDM（瀏覽器內部模組）-->>EME API（瀏覽器）: 回傳 MediaKeys
    播放器(JS)->>EME API（瀏覽器）: setMediaKeys()
    播放器(JS)->>EME API（瀏覽器）: 載入加密影片
    EME API（瀏覽器）->>播放器(JS): 觸發 encrypted 事件
    播放器(JS)->>DRM Server: 傳送 license request
    DRM Server-->>播放器(JS): 回傳 license (金鑰)
    播放器(JS)->>CDM（瀏覽器內部模組）: 提交 license
    CDM（瀏覽器內部模組）-->>EME API（瀏覽器）: 解密影片
    EME API（瀏覽器）-->>瀏覽器: 播放影片
```

---

## 處理截圖與螢幕錄影（DRM 回傳限制、CDM控制）
```mermaid
sequenceDiagram
    participant 使用者
    participant 作業系統
    participant 瀏覽器
    participant CDM（內建於瀏覽器）
    participant 顯示硬體

    使用者->>瀏覽器: 嘗試播放受保護影片
    note right of 瀏覽器: ※ 影片受 DRM 保護（如 Widevine、FairPlay）

    瀏覽器->>CDM（內建於瀏覽器）: 啟動 CDM 解密程序
    CDM（內建於瀏覽器）->>作業系統: 告知受保護內容，請檢查輸出安全性（HDCP、TEE 等）
    note right of CDM（內建於瀏覽器）: ※ 根據 DRM 政策要求安全輸出環境

    作業系統-->>CDM（內建於瀏覽器）: 回傳輸出環境狀態
    CDM（內建於瀏覽器）-->>瀏覽器: 回報是否可播放
    CDM（內建於瀏覽器）->>顯示硬體: 解密後傳送影像資料

    使用者->>作業系統: 嘗試截圖 / 錄影
    作業系統-->>使用者: 阻擋錄影（某些情況）
    作業系統-->>瀏覽器: （通常不通知截圖行為）
```

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Shaka Player
- Widevine DRM

## Quick Start

1. Clone 專案 (Clone project)：
```bash
git clone [your-repository-url]
cd DrmDemo
```

2. 安裝依賴 (Install dependencies)：
```bash
npm install
```

3. 啟動開發伺服器 (Start development server)：
```bash
npm run dev
```

## 參考資源 (Reference Resources)

- [Shaka Player 官方文檔 (Official Documentation)](https://shaka-player-demo.appspot.com/docs/api/index.html)
- [Widevine DRM 文檔 (Documentation)](https://www.widevine.com/)
- [DASH-IF 實施指南 (Implementation Guidelines)](https://dashif.org/)
- [W3C Encrypted Media Extensions (EME) 規格文件](https://www.w3.org/TR/encrypted-media/)
- [Google Shaka Player（開源 DRM 播放器）](https://shaka-player-demo.appspot.com/docs/api/tutorial-drm-config.html)
- [Mozilla MDN - Encrypted Media Extensions (EME)](https://developer.mozilla.org/en-US/docs/Web/API/Encrypted_Media_Extensions_API)
- [BuyDRM 官方文件 (BuyDRM Official Documentation)](https://docs.buydrm.com/)
- [Google Widevine DRM](https://www.widevine.com/)
- [Microsoft PlayReady DRM](https://www.microsoft.com/playready/)
- [Apple FairPlay Streaming (FPS)](https://developer.apple.com/streaming/)

# TwIdOcr

這是一個台灣身分證 OCR 辨識的 Demo 專案。使用 React + TypeScript + Vite 開發。

## 功能特點

- 台灣身分證辨識
- 即時影像處理
- 使用者友善介面

## 開發環境需求

- Node.js 18+
- npm 或 yarn

## 安裝與執行

1. 安裝依賴：
```bash
npm install
# 或
yarn
```

2. 啟動開發伺服器：
```bash
npm run dev
# 或
yarn dev
```

3. 建置專案：
```bash
npm run build
# 或
yarn build
```

## 技術棧

- React
- TypeScript
- Vite
- TailwindCSS

## 授權條款

MIT License