import*as Common from"../common/common.js";import*as SDK from"../sdk/sdk.js";import*as UI from"../ui/ui.js";export class DOMBreakpointsSidebarPane extends UI.Widget.VBox{constructor(){super(!0),this.registerRequiredCSS("browser_debugger/domBreakpointsSidebarPane.css"),this._emptyElement=this.contentElement.createChild("div","gray-info-message"),this._emptyElement.textContent=Common.UIString.UIString("No breakpoints"),this._breakpoints=new UI.ListModel.ListModel,this._list=new UI.ListControl.ListControl(this._breakpoints,this,UI.ListControl.ListMode.NonViewport),this.contentElement.appendChild(this._list.element),this._list.element.classList.add("breakpoint-list","hidden"),UI.ARIAUtils.markAsList(this._list.element),UI.ARIAUtils.setAccessibleName(this._list.element,ls`DOM Breakpoints list`),this._emptyElement.tabIndex=-1,SDK.SDKModel.TargetManager.instance().addModelListener(SDK.DOMDebuggerModel.DOMDebuggerModel,SDK.DOMDebuggerModel.Events.DOMBreakpointAdded,this._breakpointAdded,this),SDK.SDKModel.TargetManager.instance().addModelListener(SDK.DOMDebuggerModel.DOMDebuggerModel,SDK.DOMDebuggerModel.Events.DOMBreakpointToggled,this._breakpointToggled,this),SDK.SDKModel.TargetManager.instance().addModelListener(SDK.DOMDebuggerModel.DOMDebuggerModel,SDK.DOMDebuggerModel.Events.DOMBreakpointsRemoved,this._breakpointsRemoved,this);for(const e of SDK.SDKModel.TargetManager.instance().models(SDK.DOMDebuggerModel.DOMDebuggerModel)){e.retrieveDOMBreakpoints();for(const t of e.domBreakpoints())this._addBreakpoint(t)}this._highlightedBreakpoint=null,this._update()}createElementForItem(e){const t=createElementWithClass("div","breakpoint-entry");t.addEventListener("contextmenu",this._contextMenu.bind(this,e),!0),UI.ARIAUtils.markAsListitem(t),t.tabIndex=this._list.selectedItem()===e?0:-1;const i=UI.UIUtils.CheckboxLabel.create("",e.enabled),o=i.checkboxElement;o.addEventListener("click",this._checkboxClicked.bind(this,e),!1),o.tabIndex=-1,UI.ARIAUtils.markAsHidden(i),t.appendChild(i);const n=createElementWithClass("div","dom-breakpoint");t.appendChild(n),t.addEventListener("keydown",e=>{" "===e.key&&(o.click(),e.consume(!0))});const s=createElement("div"),r=BreakpointTypeLabels.get(e.type);s.textContent=r;const a=createElementWithClass("monospace");a.style.display="block",n.appendChild(a),Common.Linkifier.Linkifier.linkify(e.node,{preventKeyboardFocus:!0}).then(e=>{a.appendChild(e),UI.ARIAUtils.setAccessibleName(o,ls`${r}: ${e.deepTextContent()}`)}),n.appendChild(s);const d=e.enabled?ls`checked`:ls`unchecked`;return e===this._highlightedBreakpoint?(t.classList.add("breakpoint-hit"),UI.ARIAUtils.setDescription(t,ls`${d} breakpoint hit`)):UI.ARIAUtils.setDescription(t,d),this._emptyElement.classList.add("hidden"),this._list.element.classList.remove("hidden"),t}heightForItem(e){return 0}isItemSelectable(e){return!0}updateSelectedItemARIA(e,t){return!0}selectedItemChanged(e,t,i,o){i&&(i.tabIndex=-1),o&&(this.setDefaultFocusedElement(o),o.tabIndex=0,this.hasFocus()&&o.focus())}_breakpointAdded(e){this._addBreakpoint(e.data)}_breakpointToggled(e){const t=this.hasFocus(),i=e.data;this._list.refreshItem(i),t&&this.focus()}_breakpointsRemoved(e){const t=this.hasFocus(),i=e.data;let o=-1;for(const e of i){const t=this._breakpoints.indexOf(e);t>=0&&(this._breakpoints.remove(t),o=t)}if(0===this._breakpoints.length)this._emptyElement.classList.remove("hidden"),this.setDefaultFocusedElement(this._emptyElement),this._list.element.classList.add("hidden");else if(o>=0){const e=this._breakpoints.at(o);e&&this._list.selectItem(e)}t&&this.focus()}_addBreakpoint(e){this._breakpoints.insertWithComparator(e,(e,t)=>e.type>t.type?-1:e.type<t.type?1:0),this.hasFocus()||this._list.selectItem(this._breakpoints.at(0))}_contextMenu(e,t){const i=new UI.ContextMenu.ContextMenu(t);i.defaultSection().appendItem(ls`Reveal DOM node in Elements panel`,Common.Revealer.reveal.bind(null,e.node)),i.defaultSection().appendItem(Common.UIString.UIString("Remove breakpoint"),()=>{e.domDebuggerModel.removeDOMBreakpoint(e.node,e.type)}),i.defaultSection().appendItem(Common.UIString.UIString("Remove all DOM breakpoints"),()=>{e.domDebuggerModel.removeAllDOMBreakpoints()}),i.show()}_checkboxClicked(e,t){e.domDebuggerModel.toggleDOMBreakpoint(e,t.target.checked)}flavorChanged(e){this._update()}_update(){const e=self.UI.context.flavor(SDK.DebuggerModel.DebuggerPausedDetails);if(this._highlightedBreakpoint){const e=this._highlightedBreakpoint;delete this._highlightedBreakpoint,this._list.refreshItem(e)}if(!e||!e.auxData||e.reason!==SDK.DebuggerModel.BreakReason.DOM)return;const t=e.debuggerModel.target().model(SDK.DOMDebuggerModel.DOMDebuggerModel);if(!t)return;const i=t.resolveDOMBreakpointData(e.auxData);if(i){for(const e of this._breakpoints)e.node===i.node&&e.type===i.type&&(this._highlightedBreakpoint=e);this._highlightedBreakpoint&&this._list.refreshItem(this._highlightedBreakpoint),UI.ViewManager.ViewManager.instance().showView("sources.domBreakpoints")}}}export const BreakpointTypeLabels=new Map([[Protocol.DOMDebugger.DOMBreakpointType.SubtreeModified,Common.UIString.UIString("Subtree modified")],[Protocol.DOMDebugger.DOMBreakpointType.AttributeModified,Common.UIString.UIString("Attribute modified")],[Protocol.DOMDebugger.DOMBreakpointType.NodeRemoved,Common.UIString.UIString("Node removed")]]);export class ContextMenuProvider{appendApplicableItems(e,t,i){const o=i;if(o.pseudoType())return;const n=o.domModel().target().model(SDK.DOMDebuggerModel.DOMDebuggerModel);if(!n)return;function s(e){n.hasDOMBreakpoint(o,e)?n.removeDOMBreakpoint(o,e):n.setDOMBreakpoint(o,e)}const r=t.debugSection().appendSubMenuItem(Common.UIString.UIString("Break on"));for(const e in Protocol.DOMDebugger.DOMBreakpointType){const t=Protocol.DOMDebugger.DOMBreakpointType[e],i=Sources.DebuggerPausedMessage.BreakpointTypeNouns.get(t);r.defaultSection().appendCheckboxItem(i,s.bind(null,t),n.hasDOMBreakpoint(o,t))}}}