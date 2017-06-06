import React from "react";
import '../../css/block/gotoTop.css';
class GotoTop extends React.Component{
    constructor(props){
        super(props);
        this.state = {show:'',scrolltimer:null};
        this._onscrollHandle = this._onscrollHandle.bind(this);
    }
    _onscrollHandle(e){
        var scrolltimer = this.state.scrolltimer;
        if(scrolltimer!=null){
            return;
        }
        scrolltimer = setTimeout(function(){
            var topdistance = document.body.scrollTop;
            if(topdistance>300){
                this.setState({show:"show"});
            }else{
                this.setState({show:""});
            }
            clearTimeout(scrolltimer);
            scrolltimer = null;
            this.setState({scrolltimer:null});
        }.bind(this), 300);
        this.setState({scrolltimer:scrolltimer});
    }
    _onclickTopHandle(){
        document.body.scrollTop = 0;
    }
    componentDidMount() {
        document.addEventListener("scroll",this._onscrollHandle,false);
    }
    componentWillUnmount() {
        document.removeEventListener("scroll", this._onscrollHandle, false);
    }
    render(){
        var topClass = "top "+this.state.show;
        return (
            <div className="gotoTop">   
                <div className={topClass} id="gotoTop" onClick={(e)=>this._onclickTopHandle(e)}>
                    <img src="/babyDairy/src/image/top.png"/>
                </div>
            </div>
        );
    }
};

export default GotoTop;