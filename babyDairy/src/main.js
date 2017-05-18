var Header = React.createClass({
    _onClickHandler:function(e){
        var elem = e.target;
        if(e.target.tagName.toLowerCase() === "nav"){
            $(elem).addClass('navBack').siblings('nav').removeClass('navBack');
        }
    },
    componentDidMount:function(){
        document.getElementsByTagName("header")[0].addEventListener('click', this._onClickHandler, false);
    },
    render: function() {
        return (
            <header>
                <span className="hello">您好！宝宝</span>
                <nav>个人信息</nav>
                <nav>生活记事</nav>
                <nav>萌照</nav>
            </header>
        );
    }
});

var UploadImage = React.createClass({
    getInitialState: function() {
        return {hiddenClass: 'g-hidden'};
    },
    _onClickUploadImgHandle:function(e){
        var file = $("#file");
        file.trigger('click');
    },
    _onFileChangeHandle:function(e){
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
            $.ajax({
                type: "POST",
                url: '/upload',
                data: { img: event.target.result.split("base64,")[1] },
                dataType: 'json',
                success: function (data) {
                    var url = data.url
                    if(url){    
                        this.setState({hiddenClass: ''});
                        this.props.onGetImageHandle(url);
                        PubSubEvent.publish("imageFillUrl",[url]);
                    }
                }.bind(this)
            });
        }.bind(this);
        reader.readAsDataURL(file);
    },
    hidePreview:function(){
        this.setState({hiddenClass: 'g-hidden'});
    },
    _onClickPreviewImgHandle:function(){
        PubSubEvent.publish("imagePreviewShow");
    },
    render: function() {
        return (
            <div className="uploadImage">
                <img src="/babyDairy/src/image/upload_img_icon.png" title="上传图片" className="uploadImg" onClick={this._onClickUploadImgHandle} />
                <a href="####" className={this.state.hiddenClass} id="previewImg" onClick={this._onClickPreviewImgHandle}>点击预览</a>
                <input type="file" id="file" className="file"  onChange={this._onFileChangeHandle}  />
            </div>
        );
    }
});

var ImagePreview = React.createClass({
    getInitialState: function() {
        return {hiddenClass: 'g-hidden',url:''};
    },
    _onClickHandler: function(e) {
        this.setState({hiddenClass: 'g-hidden'});
    },
    imagePreviewShowHandle:function(){
        this.setState({hiddenClass: ''});
    },
    imageFillUrlHandle:function(url){
        this.setState({url: url});
    },
    componentDidMount:function(){
        $(".backclose").on('click', this._onClickHandler);
        PubSubEvent.subscribe("imagePreviewShow",this.imagePreviewShowHandle);
        PubSubEvent.subscribe("imageFillUrl",this.imageFillUrlHandle);
    },
    render: function() {
        var c = 'back '+this.state.hiddenClass;
        return (
            <div className={c}>
                <div className='picPreview'>
                    <img src={this.state.url} /><i className='backclose' />
                </div>
            </div>
        );
    }
});

var BabyForm = React.createClass({
    getInitialState: function() {
        return {focusTitleClass: '',focusTextareaClass: '',titleValue:'',textareaValue:'',url:''};
    },
    _onChangeHandle:function(e){
        var elem = e.target,
            tagName = elem.tagName.toLowerCase();
        if(tagName == "input"){
            this.setState({titleValue: elem.value});
        }else if(tagName == "textarea"){
            this.setState({textareaValue: elem.value});
        }
    },
    _onGetImageHandle:function(url){
        if(url){
            this.setState({url:url});
        }
    },
    _onFocusHandle:function(e){
        var elem = e.target,
            tagName = elem.tagName.toLowerCase();
        if(tagName == "input"){
            this.setState({focusTitleClass: 'textarea_focus'});
        }else if(tagName == "textarea"){
            this.setState({focusTextareaClass: 'textarea_focus'});
        }
    },
    _onBlurHandle:function(e){
        var elem = e.target,
            tagName = elem.tagName.toLowerCase();
        if(tagName == "input"){
            this.setState({focusTitleClass: ''});
        }else if(tagName == "textarea"){
            this.setState({focusTextareaClass: ''});
        }
    },
    _onSubmitHandle:function(e){
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
    },
    render: function() {
        var tClass = "babyinput babytextarea "+this.state.focusTextareaClass,
            titleClass = "babyinput babytitle "+this.state.focusTitleClass;
        return (
            <div className="box babyform g-clear">
                <input placeholder="标题" maxLength="80" value={this.state.titleValue} onChange={this._onChangeHandle} onBlur={this._onBlurHandle} onFocus={this._onFocusHandle} className={titleClass} />
                <textarea placeholder="宝宝今天有什么新鲜事吗？" onChange={this._onChangeHandle} onBlur={this._onBlurHandle} value={this.state.textareaValue} onFocus={this._onFocusHandle} name="babyinput" className={tClass}></textarea>
                <UploadImage onGetImageHandle={this._onGetImageHandle} ref = "preImage"></UploadImage>
                <a href="####" className="babysubmit" onClick={this._onSubmitHandle}>发布</a>
            </div>
        );
    }
});

var Life = React.createClass({
    render:function(){
        return (
            <div className="box life g-clear">
                <img src="/babyDairy/src/image/avatar_angel.jpg" className="avatarImg" />
                <h3>{this.props.title}</h3>
                <div>{this.props.text}</div>
            </div>
        );
    }
});

var LifeList = React.createClass({
    render:function(){
        var lifeNodes = this.props.data.map(function(life) {
            if(!life.url){
                return (
                    <Life text={life.text} title={life.title} />
                );
            }
        });
        return (
            <div className="lifeList">
                {lifeNodes}
            </div>
        );
    }
});
var Photo = React.createClass({
    getInitialState: function() {
        return {photoClass: 'photo-small'};
    },
    photoStateChange:function(e){
        var elem = $(e.target);
        if(this.state.photoClass === "photo-small"){
            this.setState({photoClass: 'photo-big'});
            elem.parent().height(elem.parent().height()+200);
        }else{
            this.setState({photoClass: 'photo-small'});
            elem.parent().height(elem.parent().height()-200);
        }
    },
    render:function(){
        var pClass = "photo-baoImg "+this.state.photoClass;
        return (
            <div className="box photo">
                <img src="/babyDairy/src/image/avatar_angel.jpg" className="avatarImg" />
                <h3>{this.props.title}</h3>
                <div className="photo-content">
                    <p>{this.props.text}</p>
                    <img src={this.props.url} className={pClass} />
                </div>
            </div>
        );
    }
});
var PhotoList = React.createClass({
    _onClickHandler:function(e){
        var $elem = $(e.target),
            $parent = $(".photoList .photo-baoImg");
        this.refs["photo"+$parent.index($elem)].photoStateChange(e);
    },
    componentDidMount:function(){
        $(".photoList").on('click', '.photo-baoImg', this._onClickHandler);
    },
    render:function(){
        var photoNodes = this.props.data.map(function(photo,index) {
            if(photo.url){
                var key = "photo"+index;
                return (
                    <Photo ref={key} text={photo.text} title={photo.title} url={photo.url}/>
                );
            }
        });
        return (
            <div className="photoList">
                {photoNodes}
            </div>
        );
    }
});
var Content = React.createClass({
    loadDataFromFile: function() {
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({data: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        this.loadDataFromFile();
    },
    getBabyFormData:function(formData){
        var data = this.state.data;
        data.unshift(formData);
        this.setState({data:data});
    },
    render:function(){
        return (
            <div className="content">
                <BabyForm onSubmitBabyForm = {this.getBabyFormData} />
                <LifeList data = {this.state.data} />
                <PhotoList data = {this.state.data} />
            </div>   
        );
    }
});

var GotoTop = React.createClass({
    getInitialState: function() {
        return {show:'',scrolltimer:null};
    },
    _onscrollHandle:function(e){
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
    },
    _onclickTopHandle:function(){
        document.body.scrollTop = 0;
    },
    componentDidMount: function() {
        document.addEventListener("scroll",this._onscrollHandle,false);
    },
    componentWillUnmount: function() {
        document.removeEventListener("scroll", this._onscrollHandle, false);
    },
    render:function(){
        var topClass = "top "+this.state.show;
        return (
            <div className="gotoTop">   
                <div className={topClass} id="gotoTop" onClick={this._onclickTopHandle}>
                    <img src="/babyDairy/src/image/top.png"/>
                </div>
            </div>
        );
    }
});

var Tools = React.createClass({
    uploadBackgroundImage:function(){
        $(".tools").find(".uploadBg").trigger('click');
    },
    _onUploadBgChangeHandle:function(e){
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
            $.ajax({
                type: "POST",
                url: '/upload',
                data: { img: event.target.result.split("base64,")[1] },
                dataType: 'json',
                success: function (data) {
                    var url = data.url
                    if(url){    
                        this.props.changeBg(url);
                    }
                }.bind(this)
            });
        }.bind(this);
        reader.readAsDataURL(file);
    },
    render:function(){
        return (
            <div className="tools">   
                <img src="/babyDairy/src/image/tool.png" className="tool"/>
                <div className="toolList">
                    <img src="/babyDairy/src/image/chg_bak.png" title="上传图片" className="changeBak" onClick={this.uploadBackgroundImage}/>
                    <input type="file"  className="uploadBg g-hidden"  onChange={this._onUploadBgChangeHandle}  />
                </div>
            </div>
        );
    }
});

var MainContent = React.createClass({
    getInitialState: function() {
        return {bgStyle:{}};
    },
    changBg:function(url){
        var style = {
            background: "url("+url+")",
            backgroundSize: "100% 100%"
        };
        this.setState({bgStyle:style});
    },
    render:function(){
        return (
            <div className="mainContent" style={this.state.bgStyle}>   
                <Header />
                <Content url="/babyDairy/data/lifedata.json" />
                <ImagePreview />
                <GotoTop />
                <Tools changeBg = {this.changBg}/>
            </div>
        );
    }
});

ReactDOM.render(
    <MainContent></MainContent>,
    $(".main-wrap")[0]
);