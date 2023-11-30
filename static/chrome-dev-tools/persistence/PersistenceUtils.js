import*as Common from"../common/common.js";import*as Components from"../components/components.js";import*as UI from"../ui/ui.js";import*as Workspace from"../workspace/workspace.js";import{FileSystemWorkspaceBinding}from"./FileSystemWorkspaceBinding.js";import{Events,PersistenceBinding,PersistenceImpl}from"./PersistenceImpl.js";export class PersistenceUtils{static tooltipForUISourceCode(e){const t=self.Persistence.persistence.binding(e);return t?e===t.network?FileSystemWorkspaceBinding.tooltipForUISourceCode(t.fileSystem):t.network.contentType().isFromSourceMap()?Common.UIString.UIString("Linked to source map: %s",t.network.url().trimMiddle(150)):Common.UIString.UIString("Linked to %s",t.network.url().trimMiddle(150)):""}static iconForUISourceCode(e){const t=self.Persistence.persistence.binding(e);if(t){if(!t.fileSystem.url().startsWith("file://"))return null;const e=UI.Icon.Icon.create("mediumicon-file-sync");return e.title=PersistenceUtils.tooltipForUISourceCode(t.network),self.Persistence.networkPersistenceManager.project()===t.fileSystem.project()&&(e.style.filter="hue-rotate(160deg)"),e}if(e.project().type()!==Workspace.Workspace.projectTypes.FileSystem||!e.url().startsWith("file://"))return null;const n=UI.Icon.Icon.create("mediumicon-file");return n.title=PersistenceUtils.tooltipForUISourceCode(e),n}}export class LinkDecorator extends Common.ObjectWrapper.ObjectWrapper{constructor(e){super(),e.addEventListener(Events.BindingCreated,this._bindingChanged,this),e.addEventListener(Events.BindingRemoved,this._bindingChanged,this)}_bindingChanged(e){const t=e.data;this.dispatchEventToListeners(Components.Linkifier.LinkDecorator.Events.LinkIconChanged,t.network)}linkIcon(e){return PersistenceUtils.iconForUISourceCode(e)}}