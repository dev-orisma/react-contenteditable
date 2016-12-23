import React from 'react';

export default class ContentEditable extends React.Component {
  constructor() {
    super();
    this.emitChange = this.emitChange.bind(this);
    this.reset = this.reset.bind(this);
    this.state = {
      htmlCache:"",
      onActive:false
    }
  }

  linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
    return replacedText;
  }
  render() {
   var { tagName, html, onChange, isReset, onReset,...props } = this.props;
   var htmlCache = this.state.htmlCache;
   if(this.state.onActive){
    return React.createElement(
      tagName || 'div',
      {
        ...props,
        ref: (e) => this.htmlEl = e,
        onInput: this.emitChange,
        onBlur: this.props.onBlur || this.emitChange,
        contentEditable: !this.props.disabled,
        dangerouslySetInnerHTML: {__html: html}
      },
      this.props.children);
  }else{
   return React.createElement(
    tagName || 'div',
    {
      ...props,
      ref: (e) => this.htmlEl = e,
      contentEditable: true,
      dangerouslySetInnerHTML: {__html: htmlCache}
    },
    this.props.children);
 }
}

shouldComponentUpdate(nextProps) {
  return (
    !this.htmlEl
    || ( nextProps.html !== this.htmlEl.innerHTML
      && nextProps.html !== this.props.html )
    || this.props.disabled !== nextProps.disabled
    );
}
componentDidMount(){
  this.setState({htmlCache:this.props.html});
}
componentDidUpdate() {
  if ( this.htmlEl && this.props.html !== this.htmlEl.innerHTML ) {
    this.htmlEl.innerHTML = this.props.html;
  }
}

emitChange(evt) {
  if (!this.htmlEl) return;
  var html = this.htmlEl.innerHTML;
  if (this.props.onChange && html !== this.lastHtml) {
    evt.target = { value: html };
    this.props.onChange(evt);
  }
  this.lastHtml = html;
}

componentWillReceiveProps(nextProps) {
  if(nextProps.isReset && nextProps.isReset === true){
    this.reset();
  }
}

reset() {
  this.htmlEl.innerHTML = '';
  if (this.props.onReset) {
    this.props.onReset();
  }
}

}
