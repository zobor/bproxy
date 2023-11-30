import*as ProtocolClient from"../protocol_client/protocol_client.js";import{OverlayModel}from"./OverlayModel.js";import{Capability,SDKModel,Target}from"./SDKModel.js";export class ScreenCaptureModel extends SDKModel{constructor(e){super(e),this._agent=e.pageAgent(),this._onScreencastFrame=null,this._onScreencastVisibilityChanged=null,e.registerPageDispatcher(this)}startScreencast(e,t,a,i,n,r,o){this._onScreencastFrame=r,this._onScreencastVisibilityChanged=o,this._agent.startScreencast(e,t,a,i,n)}stopScreencast(){this._onScreencastFrame=null,this._onScreencastVisibilityChanged=null,this._agent.stopScreencast()}async captureScreenshot(e,t,a){await OverlayModel.muteHighlight();const i=await this._agent.captureScreenshot(e,t,a,!0);return await OverlayModel.unmuteHighlight(),i}async fetchLayoutMetrics(){const e=await this._agent.invoke_getLayoutMetrics({});return e[ProtocolClient.InspectorBackend.ProtocolError]?null:{viewportX:e.visualViewport.pageX,viewportY:e.visualViewport.pageY,viewportScale:e.visualViewport.scale,contentWidth:e.contentSize.width,contentHeight:e.contentSize.height}}screencastFrame(e,t,a){this._agent.screencastFrameAck(a),this._onScreencastFrame&&this._onScreencastFrame.call(null,e,t)}screencastVisibilityChanged(e){this._onScreencastVisibilityChanged&&this._onScreencastVisibilityChanged.call(null,e)}domContentEventFired(e){}loadEventFired(e){}lifecycleEvent(e,t,a,i){}navigatedWithinDocument(e,t){}frameAttached(e,t){}frameNavigated(e){}frameDetached(e){}frameStartedLoading(e){}frameStoppedLoading(e){}frameRequestedNavigation(e){}frameScheduledNavigation(e,t){}frameClearedScheduledNavigation(e){}frameResized(){}javascriptDialogOpening(e,t,a,i,n){}javascriptDialogClosed(e,t){}interstitialShown(){}interstitialHidden(){}windowOpen(e,t,a,i){}fileChooserOpened(e){}compilationCacheProduced(e,t){}downloadWillBegin(e,t){}downloadProgress(){}}SDKModel.register(ScreenCaptureModel,Capability.ScreenCapture,!1);