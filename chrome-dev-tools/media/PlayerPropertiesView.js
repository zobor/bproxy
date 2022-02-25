import*as Common from"../common/common.js";import*as UI from"../ui/ui.js";import{ChevronTabbedPanel}from"./ChevronTabbedPanel.js";import{Event,MediaChangeTypeKeys}from"./MediaModel.js";export const PlayerPropertyKeys={kResolution:"kResolution",kTotalBytes:"kTotalBytes",kBitrate:"kBitrate",kMaxDuration:"kMaxDuration",kStartTime:"kStartTime",kIsVideoEncrypted:"kIsVideoEncrypted",kIsStreaming:"kIsStreaming",kFrameUrl:"kFrameUrl",kFrameTitle:"kFrameTitle",kIsSingleOrigin:"kIsSingleOrigin",kIsRangeHeaderSupported:"kIsRangeHeaderSupported",kVideoDecoderName:"kVideoDecoderName",kAudioDecoderName:"kAudioDecoderName",kIsPlatformVideoDecoder:"kIsPlatformVideoDecoder",kIsPlatformAudioDecoder:"kIsPlatformAudioDecoder",kIsVideoDecryptingDemuxerStream:"kIsVideoDecryptingDemuxerStream",kIsAudioDecryptingDemuxerStream:"kIsAudioDecryptingDemuxerStream",kAudioTracks:"kAudioTracks",kVideoTracks:"kVideoTracks"};export class PropertyRenderer extends UI.Widget.VBox{constructor(e){super(),this.contentElement.classList.add("media-property-renderer"),this._title=this.contentElement.createChild("span","media-property-renderer-title"),this._contents=this.contentElement.createChild("span","media-property-renderer-contents"),this._title.createTextChild(e),this._title=e,this._value=null,this._pseudo_color_protection_element=null,this.contentElement.classList.add("media-property-renderer-hidden")}updateData(e,t){if(""===t||null===t)return this._updateData(e,null);try{t=JSON.parse(t)}catch(e){}return this._updateData(e,t)}_updateData(e,t){if(null===t)this.changeContents(null);else{if(this._value===t)return;this._value=t,this.changeContents(t)}}changeContents(e){if(null===e)this.contentElement.classList.add("media-property-renderer-hidden"),null===this._pseudo_color_protection_element&&(this._pseudo_color_protection_element=createElementWithClass("div","media-property-renderer"),this._pseudo_color_protection_element.classList.add("media-property-renderer-hidden"),this.contentElement.parentNode.insertBefore(this._pseudo_color_protection_element,this.contentElement));else{null!==this._pseudo_color_protection_element&&(this._pseudo_color_protection_element.remove(),this._pseudo_color_protection_element=null),this.contentElement.classList.remove("media-property-renderer-hidden"),this._contents.removeChildren();const t=createElement("span");t.textContent=e,this._contents.appendChild(t)}}}export class FormattedPropertyRenderer extends PropertyRenderer{constructor(e,t){super(Common.UIString.UIString(e)),this._formatfunction=t}_updateData(e,t){null===t?this.changeContents(null):this.changeContents(this._formatfunction(t))}}export class DefaultPropertyRenderer extends PropertyRenderer{constructor(e,t){super(Common.UIString.UIString(e)),this.changeContents(t)}}export class DimensionPropertyRenderer extends PropertyRenderer{constructor(e){super(Common.UIString.UIString(e)),this._width=0,this._height=0}_updateData(e,t){let r=!1;"width"===e&&t!==this._width&&(this._width=t,r=!0),"height"===e&&t!==this._height&&(this._height=t,r=!0),0===this._width||0===this._height?this.changeContents(null):r&&this.changeContents(`${this._width}×${this._height}`)}}export class AttributesView extends UI.Widget.VBox{constructor(e){super(),this.contentElement.classList.add("media-attributes-view");for(const t of e)t.show(this.contentElement)}}export class TrackManager{constructor(e,t){this._type=t,this._view=e,this._previousTabs=[]}updateData(e,t){const r=this._view.GetTabs(this._type);r.RemoveTabs(this._previousTabs);const s=JSON.parse(t);let o=1;for(const e of s)this.addNewTab(r,e,o),o++}addNewTab(e,t,r){}}export class VideoTrackManager extends TrackManager{constructor(e){super(e,"video")}addNewTab(e,t,r){const s=[];for(const[e,r]of Object.entries(t))s.push(new DefaultPropertyRenderer(e,r));const o=new AttributesView(s);e.CreateAndAddDropdownButton("tab_"+r,{title:UI.Fragment.html`Track #${r}`,element:o})}}export class AudioTrackManager extends TrackManager{constructor(e){super(e,"audio")}addNewTab(e,t,r){const s=[];for(const[e,r]of Object.entries(t))s.push(new DefaultPropertyRenderer(e,r));const o=new AttributesView(s);e.CreateAndAddDropdownButton("tab_"+r,{title:UI.Fragment.html`Track #${r}`,element:o})}}export class PlayerPropertiesView extends UI.Widget.VBox{constructor(){super(),this.contentElement.classList.add("media-properties-frame"),this.registerRequiredCSS("media/playerPropertiesView.css"),this.populateAttributesAndElements(),this._videoProperties=new AttributesView(this._mediaElements),this._videoDecoderProperties=new AttributesView(this._videoDecoderElements),this._audioDecoderProperties=new AttributesView(this._audioDecoderElements);const e=new ChevronTabbedPanel({tab:{title:UI.Fragment.html`Media`,element:this._videoProperties}});e.contentElement.classList.add("media-properties-view"),e.show(this.contentElement),this._videoDecoderTab=new ChevronTabbedPanel({tab:{title:UI.Fragment.html`Video Decoder`,element:this._videoDecoderProperties}}),this._videoDecoderTab.contentElement.classList.add("media-properties-view"),this._videoDecoderTab.show(this.contentElement),this._audioDecoderTab=new ChevronTabbedPanel({tab:{title:UI.Fragment.html`Audio Decoder`,element:this._audioDecoderProperties}}),this._audioDecoderTab.contentElement.classList.add("media-properties-view"),this._audioDecoderTab.show(this.contentElement)}GetTabs(e){if("audio"===e)return this._audioDecoderTab;if("video"===e)return this._videoDecoderTab;throw new Error("Unreachable")}renderChanges(e,t,r){for(const e of t){const t=this._attributeMap.get(e.name);if(!t)throw new Error(`PlayerProperty ${e.name} not supported.`);t.updateData(e.name,e.value)}}formatKbps(e){if(""===e)return"0 kbps";return Math.floor(e/1e3)+" kbps"}formatTime(e){if(""===e)return"0:00";const t=new Date(null);return t.setSeconds(e),t.toISOString().substr(11,8)}formatFileSize(e){if(""===e)return"0 bytes";const t=Math.floor(Math.log(e)/Math.log(1024)),r=["bytes","kB","MB","GB","TB"][t];return`${(e/Math.pow(1e3,t)).toFixed(2)} ${r}`}populateAttributesAndElements(){this._mediaElements=[],this._videoDecoderElements=[],this._audioDecoderElements=[],this._attributeMap=new Map;const e=new PropertyRenderer(ls`Resolution`);this._mediaElements.push(e),this._attributeMap.set(PlayerPropertyKeys.kResolution,e);const t=new FormattedPropertyRenderer(ls`File Size`,this.formatFileSize);this._mediaElements.push(t),this._attributeMap.set(PlayerPropertyKeys.kTotalBytes,t);const r=new FormattedPropertyRenderer(ls`Bitrate`,this.formatKbps);this._mediaElements.push(r),this._attributeMap.set(PlayerPropertyKeys.kBitrate,r);const s=new FormattedPropertyRenderer(ls`Duration`,this.formatTime);this._mediaElements.push(s),this._attributeMap.set(PlayerPropertyKeys.kMaxDuration,s);const o=new PropertyRenderer(ls`Start Time`);this._mediaElements.push(o),this._attributeMap.set(PlayerPropertyKeys.kStartTime,o);const i=new PropertyRenderer(ls`Streaming`);this._mediaElements.push(i),this._attributeMap.set(PlayerPropertyKeys.kIsStreaming,i);const n=new PropertyRenderer(ls`Playback Frame URL`);this._mediaElements.push(n),this._attributeMap.set(PlayerPropertyKeys.kFrameUrl,n);const a=new PropertyRenderer(ls`Playback Frame Title`);this._mediaElements.push(a),this._attributeMap.set(PlayerPropertyKeys.kFrameTitle,a);const d=new PropertyRenderer(ls`Is Single Origin Playback`);this._mediaElements.push(d),this._attributeMap.set(PlayerPropertyKeys.kIsSingleOrigin,d);const l=new PropertyRenderer(ls`Range Header Support`);this._mediaElements.push(l),this._attributeMap.set(PlayerPropertyKeys.kIsRangeHeaderSupported,l);const p=new DefaultPropertyRenderer(ls`Decoder Name`,ls`No Decoder`);this._videoDecoderElements.push(p),this._attributeMap.set(PlayerPropertyKeys.kVideoDecoderName,p);const c=new PropertyRenderer(ls`Hardware Decoder`);this._videoDecoderElements.push(c),this._attributeMap.set(PlayerPropertyKeys.kIsPlatformVideoDecoder,c);const h=new PropertyRenderer(ls`Decrypting Demuxer`);this._videoDecoderElements.push(h),this._attributeMap.set(PlayerPropertyKeys.kIsVideoDecryptingDemuxerStream,h);const m=new VideoTrackManager(this);this._attributeMap.set(PlayerPropertyKeys.kVideoTracks,m);const u=new DefaultPropertyRenderer(ls`Decoder Name`,ls`No Decoder`);this._audioDecoderElements.push(u),this._attributeMap.set(PlayerPropertyKeys.kAudioDecoderName,u);const _=new PropertyRenderer(ls`Hardware Decoder`);this._audioDecoderElements.push(_),this._attributeMap.set(PlayerPropertyKeys.kIsPlatformAudioDecoder,_);const y=new PropertyRenderer(ls`Decrypting Demuxer`);this._audioDecoderElements.push(y),this._attributeMap.set(PlayerPropertyKeys.kIsAudioDecryptingDemuxerStream,y);const P=new AudioTrackManager(this);this._attributeMap.set(PlayerPropertyKeys.kAudioTracks,P)}}