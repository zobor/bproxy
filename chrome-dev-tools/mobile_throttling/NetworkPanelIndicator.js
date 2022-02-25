import*as Common from"../common/common.js";import*as SDK from"../sdk/sdk.js";import*as UI from"../ui/ui.js";export class NetworkPanelIndicator{constructor(){if(!self.UI.inspectorView.hasPanel("network"))return;const e=self.SDK.multitargetNetworkManager;function t(){let t=null;e.isThrottling()?(t=UI.Icon.Icon.create("smallicon-warning"),t.title=Common.UIString.UIString("Network throttling is enabled")):self.SDK.multitargetNetworkManager.isIntercepting()?(t=UI.Icon.Icon.create("smallicon-warning"),t.title=Common.UIString.UIString("Requests may be rewritten by local overrides")):e.isBlocking()&&(t=UI.Icon.Icon.create("smallicon-warning"),t.title=Common.UIString.UIString("Requests may be blocked")),self.UI.inspectorView.setPanelIcon("network",t)}e.addEventListener(SDK.NetworkManager.MultitargetNetworkManager.Events.ConditionsChanged,t),e.addEventListener(SDK.NetworkManager.MultitargetNetworkManager.Events.BlockedPatternsChanged,t),e.addEventListener(SDK.NetworkManager.MultitargetNetworkManager.Events.InterceptorsChanged,t),t()}}