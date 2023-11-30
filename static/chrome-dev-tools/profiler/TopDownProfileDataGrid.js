import*as SDK from"../sdk/sdk.js";import*as UI from"../ui/ui.js";import{Formatter,ProfileDataGridNode,ProfileDataGridTree}from"./ProfileDataGrid.js";export class TopDownProfileDataGridNode extends ProfileDataGridNode{constructor(e,r){super(e,r,!(!e.children||!e.children.length)),this._remainingChildren=e.children}static _sharedPopulate(e){const r=e._remainingChildren,i=r.length;for(let o=0;o<i;++o)e.appendChild(new TopDownProfileDataGridNode(r[o],e.tree));e._remainingChildren=null}static _excludeRecursively(e,r){e._remainingChildren&&e.populate(),e.save();const i=e.children;let o=e.children.length;for(;o--;)TopDownProfileDataGridNode._excludeRecursively(i[o],r);const t=e.childrenByCallUID.get(r);t&&ProfileDataGridNode.merge(e,t,!0)}populateChildren(){TopDownProfileDataGridNode._sharedPopulate(this)}}export class TopDownProfileDataGridTree extends ProfileDataGridTree{constructor(e,r,i,o){super(e,r,o),this._remainingChildren=i.children,ProfileDataGridNode.populate(this)}focus(e){e&&(this.save(),e.savePosition(),this.children=[e],this.total=e.total)}exclude(e){e&&(this.save(),TopDownProfileDataGridNode._excludeRecursively(this,e.callUID),this.lastComparator&&this.sort(this.lastComparator,!0))}restore(){this._savedChildren&&(this.children[0].restorePosition(),super.restore())}populateChildren(){TopDownProfileDataGridNode._sharedPopulate(this)}}