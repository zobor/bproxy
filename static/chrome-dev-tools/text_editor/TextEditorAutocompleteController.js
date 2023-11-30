import*as Common from"../common/common.js";import*as TextUtils from"../text_utils/text_utils.js";import*as UI from"../ui/ui.js";import{CodeMirrorTextEditor}from"./CodeMirrorTextEditor.js";import{changeObjectToEditOperation}from"./CodeMirrorUtils.js";export class TextEditorAutocompleteController{constructor(t,e,i){this._textEditor=t,this._codeMirror=e,this._config=i,this._initialized=!1,this._onScroll=this._onScroll.bind(this),this._onCursorActivity=this._onCursorActivity.bind(this),this._changes=this._changes.bind(this),this._blur=this._blur.bind(this),this._beforeChange=this._beforeChange.bind(this),this._mouseDown=()=>{this.clearAutocomplete(),this._tooltipGlassPane.hide()},this._codeMirror.on("changes",this._changes),this._lastHintText="",this._suggestBox=null,this._currentSuggestion=null,this._hintElement=createElementWithClass("span","auto-complete-text"),this._tooltipGlassPane=new UI.GlassPane.GlassPane,this._tooltipGlassPane.setSizeBehavior(UI.GlassPane.SizeBehavior.MeasureContent),this._tooltipGlassPane.setOutsideClickCallback(this._tooltipGlassPane.hide.bind(this._tooltipGlassPane)),this._tooltipElement=createElementWithClass("div","autocomplete-tooltip");UI.Utils.createShadowRootWithCoreStyles(this._tooltipGlassPane.contentElement,"text_editor/autocompleteTooltip.css").appendChild(this._tooltipElement)}_initializeIfNeeded(){this._initialized||(this._initialized=!0,this._codeMirror.on("scroll",this._onScroll),this._codeMirror.on("cursorActivity",this._onCursorActivity),this._codeMirror.on("mousedown",this._mouseDown),this._codeMirror.on("blur",this._blur),this._config.isWordChar&&(this._codeMirror.on("beforeChange",this._beforeChange),this._dictionary=new Common.TextDictionary.TextDictionary,this._addWordsFromText(this._codeMirror.getValue())))}dispose(){this._codeMirror.off("changes",this._changes),this._initialized&&(this._codeMirror.off("scroll",this._onScroll),this._codeMirror.off("cursorActivity",this._onCursorActivity),this._codeMirror.off("mousedown",this._mouseDown),this._codeMirror.off("blur",this._blur)),this._dictionary&&(this._codeMirror.off("beforeChange",this._beforeChange),this._dictionary.reset())}_beforeChange(t,e){this._updatedLines=this._updatedLines||{};for(let t=e.from.line;t<=e.to.line;++t)void 0===this._updatedLines[t]&&(this._updatedLines[t]=this._codeMirror.getLine(t))}_addWordsFromText(t){TextUtils.TextUtils.Utils.textToWords(t,this._config.isWordChar,function(t){t.length&&(t[0]<"0"||t[0]>"9")&&this._dictionary.addWord(t)}.bind(this))}_removeWordsFromText(t){TextUtils.TextUtils.Utils.textToWords(t,this._config.isWordChar,t=>this._dictionary.removeWord(t))}_substituteRange(t,e){let i=this._config.substituteRangeCallback?this._config.substituteRangeCallback(t,e):null;return!i&&this._config.isWordChar&&(i=this._textEditor.wordRangeForCursorPosition(t,e,this._config.isWordChar)),i}_wordsWithQuery(t,e,i){const o=this._config.suggestionsCallback?this._config.suggestionsCallback(t,e,i):null;if(o)return o;if(!this._dictionary||!i&&t.isEmpty())return Promise.resolve([]);let s=this._dictionary.wordsWithPrefix(this._textEditor.text(t));const r=this._textEditor.text(e);return 1===this._dictionary.wordCount(r)&&(s=s.filter(t=>t!==r)),s.sort((t,e)=>this._dictionary.wordCount(e)-this._dictionary.wordCount(t)||t.length-e.length),Promise.resolve(s.map(t=>({text:t})))}_changes(t,e){if(!e.length)return;if(this._dictionary&&this._updatedLines){for(const t in this._updatedLines)this._removeWordsFromText(this._updatedLines[t]);delete this._updatedLines;const t={};for(let i=0;i<e.length;++i){const o=e[i],s=changeObjectToEditOperation(o);for(let e=s.newRange.startLine;e<=s.newRange.endLine;++e)t[e]=this._codeMirror.getLine(e)}for(const e in t)this._addWordsFromText(t[e])}let i=!1,o=!1;const s=this._codeMirror.getCursor("head");for(let t=0;t<e.length;++t){const r=e[t];if("+input"===r.origin&&1===r.text.length&&1===r.text[0].length&&r.to.line===s.line&&r.to.ch+1===s.ch){i=!0;break}if("+delete"===r.origin&&1===r.removed.length&&1===r.removed[0].length&&r.to.line===s.line&&r.to.ch-1===s.ch){o=!0;break}}this._queryRange&&(i?this._queryRange.endColumn++:o&&this._queryRange.endColumn--,(o||i)&&this._setHint(this._lastHintText)),i||o?setImmediate(this.autocomplete.bind(this)):this.clearAutocomplete()}_blur(){this.clearAutocomplete()}_validateSelectionsContexts(t){const e=this._codeMirror.listSelections();if(e.length<=1)return!0;const i=this._textEditor.text(t);for(let t=0;t<e.length;++t){const o=this._substituteRange(e[t].head.line,e[t].head.ch);if(!o)return!1;if(this._textEditor.text(o)!==i)return!1}return!0}autocomplete(t){if(this._initializeIfNeeded(),this._codeMirror.somethingSelected())return void this._hideSuggestBox();const e=this._codeMirror.getCursor("head"),i=this._substituteRange(e.line,e.ch);if(!i||!this._validateSelectionsContexts(i))return void this._hideSuggestBox();const o=i.clone();o.endColumn=e.ch;const s=this._textEditor.text(o);let r=!1;this._suggestBox&&(r=!0),this._wordsWithQuery(o,i,t).then(function(t){if(!t.length||1===t.length&&s===t[0].text||!this._suggestBox&&r)return this._hideSuggestBox(),void this._onSuggestionsShownForTest([]);this._suggestBox||(this._suggestBox=new UI.SuggestBox.SuggestBox(this,20),this._config.anchorBehavior&&this._suggestBox.setAnchorBehavior(this._config.anchorBehavior));const e=this._queryRange;this._queryRange=o,e&&o.startLine===e.startLine&&o.startColumn===e.startColumn||this._updateAnchorBox();this._suggestBox.updateSuggestions(this._anchorBox,t,!0,!this._isCursorAtEndOfLine(),s),this._suggestBox.visible&&this._tooltipGlassPane.hide();this._onSuggestionsShownForTest(t)}.bind(this))}_setHint(t){const e=this._textEditor.text(this._queryRange);if(!t||!this._isCursorAtEndOfLine()||!t.startsWith(e))return void this._clearHint();const i=t.substring(e.length).split("\n")[0];this._hintElement.textContent=i.trimEndWithMaxLength(1e4);const o=this._codeMirror.getCursor("to");if(this._hintMarker){const t=this._hintMarker.position();t&&t.equal(TextUtils.TextRange.TextRange.createFromLocation(o.line,o.ch))||(this._hintMarker.clear(),this._hintMarker=null)}this._hintMarker?this._lastHintText!==t&&this._hintMarker.refresh():this._hintMarker=this._textEditor.addBookmark(o.line,o.ch,this._hintElement,TextEditorAutocompleteController.HintBookmark,!0),this._lastHintText=t}_clearHint(){this._hintElement.textContent&&(this._lastHintText="",this._hintElement.textContent="",this._hintMarker&&this._hintMarker.refresh())}_onSuggestionsShownForTest(t){}_onSuggestionsHiddenForTest(){}clearAutocomplete(){this._tooltipGlassPane.hide(),this._hideSuggestBox()}_hideSuggestBox(){this._suggestBox&&(this._suggestBox.hide(),this._suggestBox=null,this._queryRange=null,this._anchorBox=null,this._currentSuggestion=null,this._textEditor.dispatchEventToListeners(UI.TextEditor.Events.SuggestionChanged),this._clearHint(),this._onSuggestionsHiddenForTest())}keyDown(t){if(this._tooltipGlassPane.isShowing()&&t.keyCode===UI.KeyboardShortcut.Keys.Esc.code)return this._tooltipGlassPane.hide(),!0;if(!this._suggestBox)return!1;switch(t.keyCode){case UI.KeyboardShortcut.Keys.Tab.code:return this._suggestBox.acceptSuggestion(),this.clearAutocomplete(),!0;case UI.KeyboardShortcut.Keys.End.code:case UI.KeyboardShortcut.Keys.Right.code:return this._isCursorAtEndOfLine()?(this._suggestBox.acceptSuggestion(),this.clearAutocomplete(),!0):(this.clearAutocomplete(),!1);case UI.KeyboardShortcut.Keys.Left.code:case UI.KeyboardShortcut.Keys.Home.code:return this.clearAutocomplete(),!1;case UI.KeyboardShortcut.Keys.Esc.code:return this.clearAutocomplete(),!0}return this._suggestBox.keyPressed(t)}_isCursorAtEndOfLine(){const t=this._codeMirror.getCursor("to");return t.ch===this._codeMirror.getLine(t.line).length}applySuggestion(t,e){const i=this._currentSuggestion;this._currentSuggestion=t,this._setHint(t?t.text:""),(i?i.text:"")!==(t?t.text:"")&&this._textEditor.dispatchEventToListeners(UI.TextEditor.Events.SuggestionChanged)}acceptSuggestion(){const t=this._codeMirror.listSelections().slice(),e=this._queryRange.endColumn-this._queryRange.startColumn,i=this._currentSuggestion.text;this._codeMirror.operation(()=>{for(let o=t.length-1;o>=0;--o){const s=t[o].head,r=new CodeMirror.Pos(s.line,s.ch-e);this._codeMirror.replaceRange(i,s,r,"+autocomplete")}})}textWithCurrentSuggestion(){if(!this._queryRange||null===this._currentSuggestion)return this._codeMirror.getValue();const t=this._codeMirror.listSelections().slice();let e={line:0,column:0},i="";const o=this._queryRange.endColumn-this._queryRange.startColumn;for(const s of t){const t=new TextUtils.TextRange.TextRange(e.line,e.column,s.head.line,s.head.ch-o);i+=this._textEditor.text(t),i+=this._currentSuggestion.text,e={line:s.head.line,column:s.head.ch}}const s=new TextUtils.TextRange.TextRange(e.line,e.column,1/0,1/0);return i+=this._textEditor.text(s),i}_onScroll(){if(this._tooltipGlassPane.hide(),!this._suggestBox)return;const t=this._codeMirror.getCursor(),e=this._codeMirror.getScrollInfo(),i=this._codeMirror.lineAtHeight(e.top,"local"),o=this._codeMirror.lineAtHeight(e.top+e.clientHeight,"local");t.line<i||t.line>o?this.clearAutocomplete():(this._updateAnchorBox(),this._suggestBox.setPosition(this._anchorBox))}async _updateTooltip(){const t=this._codeMirror.getCursor(),e=this._config.tooltipCallback?await this._config.tooltipCallback(t.line,t.ch):null,i=this._codeMirror.getCursor();if(i.line!==t.line&&i.ch!==t.ch)return;if(this._suggestBox&&this._suggestBox.visible)return;if(!e)return void this._tooltipGlassPane.hide();const o=this._textEditor.cursorPositionToCoordinates(t.line,t.ch);o?(this._tooltipGlassPane.setContentAnchorBox(new AnchorBox(o.x,o.y,0,o.height)),this._tooltipElement.removeChildren(),this._tooltipElement.appendChild(e),this._tooltipGlassPane.show(this._textEditor.element.ownerDocument)):this._tooltipGlassPane.hide()}_onCursorActivity(){if(this._updateTooltip(),!this._suggestBox)return;const t=this._codeMirror.getCursor();let e=!(t.line===this._queryRange.startLine&&this._queryRange.startColumn<=t.ch&&t.ch<=this._queryRange.endColumn);if(t.line===this._queryRange.startLine&&t.ch===this._queryRange.endColumn+1){const i=this._codeMirror.getLine(t.line);e=!!this._config.isWordChar&&!this._config.isWordChar(i.charAt(t.ch-1))}e&&this.clearAutocomplete(),this._onCursorActivityHandledForTest()}_onCursorActivityHandledForTest(){}_updateAnchorBox(){const t=this._queryRange.startLine,e=this._queryRange.startColumn,i=this._textEditor.cursorPositionToCoordinates(t,e);this._anchorBox=i?new AnchorBox(i.x,i.y,0,i.height):null}}TextEditorAutocompleteController.HintBookmark=Symbol("hint");