import React from "react";
import '../../css/baby/life.css';
class Life extends React.Component{
    render(){
        return (
            <div className="box life g-clear">
                <img src={this.props.avatar} className="avatarImg" />
                <h3>{this.props.title}</h3>
                <div>{this.props.text}</div>
            </div>
        );
    }
};

class LifeList extends React.Component{
    render() {
        let lifeNodes = this.props.data.map(function(life) {
        if(!life.url){
                return (
                    <Life key={life.id} text={life.text} title={life.title}  avatar={this.props.avatar}/>
                );
            }
        }.bind(this));
        return (
            <div className="lifeList">
                {lifeNodes}
            </div>
        );
    }
};

export {LifeList,Life};
