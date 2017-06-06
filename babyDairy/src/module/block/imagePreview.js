import React from "react";
import {PubSubEvent} from "../../../lib/util/pubSubEvent";
class ImagePreview extends React.Component{
    constructor(props){
        super(props);
        this.state = {hiddenClass: 'g-hidden',url:''};
    }
    _onClickHandler(e) {
        this.setState({hiddenClass: 'g-hidden'});
    }
    imagePreviewShowHandle(){
        this.setState({hiddenClass: ''});
    }
    imageFillUrlHandle(url){
        this.setState({url: url});
    }
    componentDidMount(){
        PubSubEvent.subscribe("imagePreviewShow",this.imagePreviewShowHandle.bind(this));
        PubSubEvent.subscribe("imageFillUrl",this.imageFillUrlHandle.bind(this));
    }
    render() {
        let c = 'back '+this.state.hiddenClass;
        return (
            <div className={c}>
                <div className='picPreview'>
                    <img src={this.state.url} /><i className='backclose' onClick={(e)=>this._onClickHandler(e)} />
                </div>
            </div>
        );
    }
};

export default ImagePreview;