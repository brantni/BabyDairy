import React from "react";
import UploadImage from './uploadImage';
import '../../css/baby/babyform.css';
class BabyForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {focusTitleClass: '',focusTextareaClass: '',titleValue:'',textareaValue:'',url:''};
        this._onGetImageHandle = this._onGetImageHandle.bind(this);
    }
    _onChangeHandle(e){
        var elem = e.target,
            tagName = elem.tagName.toLowerCase();
        if(tagName == "input"){
            this.setState({titleValue: elem.value});
        }else if(tagName == "textarea"){
            this.setState({textareaValue: elem.value});
        }
    }
    _onGetImageHandle(url){
        if(url){
            this.setState({url:url});
        }
    }
    _onFocusHandle(e){
        var elem = e.target,
            tagName = elem.tagName.toLowerCase();
        if(tagName == "input"){
            this.setState({focusTitleClass: 'textarea_focus'});
        }else if(tagName == "textarea"){
            this.setState({focusTextareaClass: 'textarea_focus'});
        }
    }
    _onBlurHandle(e){
        var elem = e.target,
            tagName = elem.tagName.toLowerCase();
        if(tagName == "input"){
            this.setState({focusTitleClass: ''});
        }else if(tagName == "textarea"){
            this.setState({focusTextareaClass: ''});
        }
    }
    _onSubmitHandle(e){
        var titleval = this.state.titleValue,
            textareaval = this.state.textareaValue,
            url = this.state.url;
        
        if(textareaval||url){
            var comment = {title:titleval,text:textareaval,url:url};
            $.ajax({
                type: "get",
                url: '/submit',
                data:comment,
                dataType: 'json',
                cache: false,
                success: function(data) {
                    if(data.status==1){
                        this.props.onSubmitBabyForm(comment);
                        this.setState({titleValue:'',textareaValue:'',url:''});
                        this.refs["preImage"].hidePreview();
                    }
                }.bind(this),
                error: function(xhr, status, err) {
                    // console.error(err.toString());
                }.bind(this)
            });
        }else{
            alert("写点什么吧！");
        }
    }
    render() {
        let tClass = "babyinput babytextarea "+this.state.focusTextareaClass,
            titleClass = "babyinput babytitle "+this.state.focusTitleClass;
        return (
            <div className="box babyform g-clear">
                <input placeholder="标题" maxLength="80" value={this.state.titleValue} onChange={(e)=>this._onChangeHandle(e)} onBlur={(e)=>this._onBlurHandle(e)} onFocus={(e)=>this._onFocusHandle(e)} className={titleClass} />
                <textarea placeholder="宝宝今天有什么新鲜事吗？" onChange={(e)=>this._onChangeHandle(e)} onBlur={(e)=>this._onBlurHandle(e)} value={this.state.textareaValue} onFocus={(e)=>this._onFocusHandle(e)} name="babyinput" className={tClass}></textarea>
                <UploadImage onGetImageHandle={this._onGetImageHandle} ref = "preImage"></UploadImage>
                <a href="####" className="babysubmit" onClick={(e)=>this._onSubmitHandle(e)}>发布</a>
            </div>
        );
    }
};

export default BabyForm;