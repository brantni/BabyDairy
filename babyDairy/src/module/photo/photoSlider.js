import React from "react";
import {PubSubEvent} from "../../../lib/util/pubSubEvent";

import '../../css/photo/photoSlider.css';
class PhotoSlider extends React.Component{
    constructor(props){
        super(props);
        this.state = {hiddenClass: 'g-hidden',data:[],currentIndex:0};
        PubSubEvent.subscribe("sliderShow",this.sliderShowHandle.bind(this));
    }
    sliderShowHandle(index){
        this.setState({hiddenClass:'',currentIndex:index});
    }
    _onRightClickHandler(e) {
        let currentIndex = this.state.currentIndex;
        if(currentIndex == this.props.data.length-1){
            this.setState({currentIndex:0});
        }else{
            this.setState({currentIndex:currentIndex+1});
        }
    }
    _onLeftClickHandler(e) {
        let currentIndex = this.state.currentIndex;
        if(currentIndex == 0){
            this.setState({currentIndex:this.props.data.length-1});
        }else{
            this.setState({currentIndex:currentIndex-1});
        }
    }
    _onCloseClickHandler(e){
        this.setState({hiddenClass:'g-hidden'});
    }
    render() {
        let c = 'photoSlider photoSlider-back '+this.state.hiddenClass;
        let liNodes = this.props.data.map(function(li,index){
            let key = "slider"+index;
            if(index == this.state.currentIndex){
                return (
                    <li key={key} id={key} className="show" >
                        <img src={li.url} />
                    </li>
                );
            }else{
                return (
                    <li key={key} id={key} >
                        <img src={li.url}/>
                    </li>
                );
            }
            
        }.bind(this));
        return (
            <div className={c}>
                <div className='wrap'>
                    <ul>
                        {liNodes}
                    </ul>
                    <p className="arrow left" onClick={(e)=>this._onLeftClickHandler(e)}></p>
                    <p className="arrow right" onClick={(e)=>this._onRightClickHandler(e)}></p>
                    <i className="close" onClick={(e)=>this._onCloseClickHandler(e)}></i>
                </div>
            </div>
        );
    }
};

export default PhotoSlider;