import React from "react";
import {PubSubEvent} from "../../../lib/util/pubSubEvent";
import {Util} from "../../../lib/util/util";
class UploadImage extends React.Component{
    constructor(props){
        super(props);
        this.state = {hiddenClass: 'g-hidden'};
    }
    _onClickUploadImgHandle (e) {
        var file = $("#file");
        file.trigger('click');
    }
    _onFileChangeHandle (e) {
        var promise = Util.uploadFile(e);
        promise.then(function(data){
            var url = data.url
            if(url){    
                this.setState({hiddenClass: ''});
                this.props.onGetImageHandle(url);
                PubSubEvent.publish("imageFillUrl",[url]);
            }
        }.bind(this));
    }
    hidePreview () {
        this.setState({hiddenClass: 'g-hidden'});
    }
    _onClickPreviewImgHandle () {
        PubSubEvent.publish("imagePreviewShow");
    }
    render() {
        return (
            <div className="uploadImage">
                <img src="/babyDairy/src/image/chicken1.png" title="上传图片" className="uploadImg" onClick={(e)=>this._onClickUploadImgHandle(e)} />
                <a href="####" className={this.state.hiddenClass} id="previewImg" onClick={(e)=>this._onClickPreviewImgHandle(e)}>点击预览</a>
                <input type="file" id="file" className="file"  onChange={(e)=>this._onFileChangeHandle(e)}  />
            </div>
        );
    }
};
export default UploadImage;