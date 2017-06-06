import React from "react";
import '../../css/baby/photo.css';
class Photo extends React.Component{
    constructor(props){
        super(props);
        this.state = {photoClass: 'photo-small'};
        this.photoStateChange = this.photoStateChange.bind(this);
    }
    photoStateChange(e){
        var elem = $(e.target);
        if(this.state.photoClass === "photo-small"){
            this.setState({photoClass: 'photo-big'});
            elem.parent().height(elem.parent().height()+200);
        }else{
            this.setState({photoClass: 'photo-small'});
            elem.parent().height(elem.parent().height()-200);
        }
    }
    render() {
        var pClass = "photo-baoImg "+this.state.photoClass;
        return (
            <div className="box photo">
                <img src={this.props.avatar} className="avatarImg" />
                <h3>{this.props.title}</h3>
                <div className="photo-content">
                    <p>{this.props.text}</p>
                    <img src={this.props.url} className={pClass} />
                </div>
            </div>
        );
    }
};

class PhotoList extends React.Component{
    constructor(props){
        super(props);
        this.state = {photoClass: 'photo-small'};
        this._onClickHandler = this._onClickHandler.bind(this);
    }
    _onClickHandler(e){
        var $elem = $(e.target),
            $parent = $(".photoList .photo-baoImg");
        this.refs["photo"+$parent.index($elem)].photoStateChange(e);
    }
    componentDidMount(){
        $(".photoList").on('click', '.photo-baoImg', this._onClickHandler);
    }
    render(){
        var photoNodes = this.props.data.map(function(photo,index) {
            if(photo.url){
                var key = "photo"+index;
                return (
                    <Photo  key={photo.id} ref={key} text={photo.text} title={photo.title} url={photo.url} avatar={this.props.avatar} />
                );
            }
        }.bind(this));
        return (
            <div className="photoList">
                {photoNodes}
            </div>
        );
    }
};
export {PhotoList,Photo};
