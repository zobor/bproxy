import*as Common from"../common/common.js";import*as SDK from"../sdk/sdk.js";import*as UI from"../ui/ui.js";import{Event,Events,MediaChangeTypeKeys,MediaModel}from"./MediaModel.js";import{PlayerDetailView}from"./PlayerDetailView.js";import{PlayerListView}from"./PlayerListView.js";export class MainView extends UI.Panel.PanelWithSidebar{constructor(){super("Media"),this.registerRequiredCSS("media/mediaView.css"),this._detailPanels=new Map,this._deletedPlayers=new Set,this._sidebar=new PlayerListView(this),this._sidebar.show(this.panelSidebarElement()),SDK.SDKModel.TargetManager.instance().observeModels(MediaModel,this)}renderChanges(e,s,t){this._deletedPlayers.has(e)||this._detailPanels.has(e)&&(this._sidebar.renderChanges(e,s,t),this._detailPanels.get(e).renderChanges(e,s,t))}renderMainPanel(e){this._detailPanels.has(e)&&(this.splitWidget().mainWidget().detachChildWidgets(),this._detailPanels.get(e).show(this.mainElement()))}_onPlayerCreated(e){this._sidebar.addMediaElementItem(e),this._detailPanels.set(e,new PlayerDetailView)}wasShown(){super.wasShown();for(const e of SDK.SDKModel.TargetManager.instance().models(MediaModel))this._addEventListeners(e)}willHide(){for(const e of SDK.SDKModel.TargetManager.instance().models(MediaModel))this._removeEventListeners(e)}modelAdded(e){this.isShowing()&&this._addEventListeners(e)}modelRemoved(e){this._removeEventListeners(e)}_addEventListeners(e){e.ensureEnabled(),e.addEventListener(Events.PlayerPropertiesChanged,this._propertiesChanged,this),e.addEventListener(Events.PlayerEventsAdded,this._eventsAdded,this),e.addEventListener(Events.PlayersCreated,this._playersCreated,this)}_removeEventListeners(e){e.removeEventListener(Events.PlayerPropertiesChanged,this._propertiesChanged,this),e.removeEventListener(Events.PlayerEventsAdded,this._eventsAdded,this),e.removeEventListener(Events.PlayersCreated,this._playersCreated,this)}_propertiesChanged(e){this.renderChanges(e.data.playerId,e.data.properties,MediaChangeTypeKeys.Property)}_eventsAdded(e){this.renderChanges(e.data.playerId,e.data.events,MediaChangeTypeKeys.Event)}_playersCreated(e){const s=e.data;for(const e of s)this._onPlayerCreated(e)}}