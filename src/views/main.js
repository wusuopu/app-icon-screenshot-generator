const electron = require('electron');
const _ = require('lodash');

const IconItem = React.createClass({
  render() {
    return (
      <div>
        <img src={this.props.url} alt="" />
        <p>{this.props.name}</p>
      </div>
    );
  }
});
const IconList = React.createClass({
  render() {
    return (
      <div>
        <h3>Android</h3>
        <IconItem url={"file://" + this.props.path + '/android/mipmap-ldpi/ic_launcher.png'} name="ldpi" />
        <IconItem url={"file://" + this.props.path + '/android/mipmap-mdpi/ic_launcher.png'} name="mdpi" />
        <IconItem url={"file://" + this.props.path + '/android/mipmap-hdpi/ic_launcher.png'} name="hdpi" />
        <IconItem url={"file://" + this.props.path + '/android/mipmap-xhdpi/ic_launcher.png'} name="xhdpi" />
        <IconItem url={"file://" + this.props.path + '/android/mipmap-xxhdpi/ic_launcher.png'} name="xxhdpi" />
        <IconItem url={"file://" + this.props.path + '/android/mipmap-xxxhdpi/ic_launcher.png'} name="xxxhdpi" />
        <IconItem url={"file://" + this.props.path + '/android/playstore-icon.png'} name="web" />

        <h3>IOS</h3>
        <IconItem url={"file://" + this.props.path + '/ios/AppIcon.appiconset/Icon-40.png'} name="Icon-40" />
        <IconItem url={"file://" + this.props.path + '/ios/AppIcon.appiconset/Icon-40@2x.png'} name="Icon-40@2x" />
        <IconItem url={"file://" + this.props.path + '/ios/AppIcon.appiconset/Icon-40@3x.png'} name="Icon-40@3x" />
        <IconItem url={"file://" + this.props.path + '/ios/AppIcon.appiconset/Icon-60@2x.png'} name="Icon-60@2x" />
        <IconItem url={"file://" + this.props.path + '/ios/AppIcon.appiconset/Icon-60@3x.png'} name="Icon-60@3x" />
        <IconItem url={"file://" + this.props.path + '/ios/AppIcon.appiconset/Icon-76.png'} name="Icon-76" />
        <IconItem url={"file://" + this.props.path + '/ios/AppIcon.appiconset/Icon-76@2x.png'} name="Icon-76@2x" />
        <IconItem url={"file://" + this.props.path + '/ios/AppIcon.appiconset/Icon-83.5@2x.png'} name="Icon-83.5@2x" />
        <IconItem url={"file://" + this.props.path + '/ios/AppIcon.appiconset/Icon-Small.png'} name="Icon-Small" />
        <IconItem url={"file://" + this.props.path + '/ios/AppIcon.appiconset/Icon-Small@2x.png'} name="Icon-Small@2x" />
        <IconItem url={"file://" + this.props.path + '/ios/AppIcon.appiconset/Icon-Small@3x.png'} name="Icon-Small@3x" />

        <h3>Apple Watch</h3>
        <IconItem url={"file://" + this.props.path + '/watchkit/AppIcon.appiconset/Icon-24@2x.png'} name="Icon-24@2x" />
        <IconItem url={"file://" + this.props.path + '/watchkit/AppIcon.appiconset/Icon-27.5@2x.png'} name="Icon-27.5@2x" />
        <IconItem url={"file://" + this.props.path + '/watchkit/AppIcon.appiconset/Icon-29@2x.png'} name="Icon-29@2x" />
        <IconItem url={"file://" + this.props.path + '/watchkit/AppIcon.appiconset/Icon-29@3x.png'} name="Icon-29@3x" />
        <IconItem url={"file://" + this.props.path + '/watchkit/AppIcon.appiconset/Icon-40@2x.png'} name="Icon-40@2x" />
        <IconItem url={"file://" + this.props.path + '/watchkit/AppIcon.appiconset/Icon-44@2x.png'} name="Icon-44@2x" />
        <IconItem url={"file://" + this.props.path + '/watchkit/AppIcon.appiconset/Icon-86@2x.png'} name="Icon-86@2x" />
        <IconItem url={"file://" + this.props.path + '/watchkit/AppIcon.appiconset/Icon-98@2x.png'} name="Icon-98@2x" />
      </div>
    );
  }
});
const IconPage = React.createClass({
  getInitialState() {
    return {
      status: 'start'   // start | finish
    };
  },
  render() {
    let content;
    if (this.state.status === 'finish') {
      content = (
        <div>
          <div>图标已生成到 <a href="#" onClick={this.openFolder}>{this.state.result}</a></div>
          <IconList path={this.state.result} />
        </div>
      );
    }
    return (
      <div className="container">
        <form>
          <div className="form-group">
            <label>选择Icon文件</label>
            <input type="file" ref="file" accept="image/*" />
          </div>
          <div className="checkbox">
            <label>
              <input type="checkbox" ref="surround" /> Android使用圆角
            </label>
          </div>
          <a href="#" className="btn btn-primary" onClick={this.generateIcons}>生成</a>
        </form>

        <hr />

        {content}
      </div>
    );
  },

  generateIcons() {
    if (this.refs.file.files.length === 0) {
      return;
    }
    if (this.state.status === 'finish') {
      this.setState({status: 'start'});
    }
    setTimeout(() => {
      IconKit.generate( this.refs.file.files[0].path, this.refs.surround.checked, (err, result) => {
        if (!err) {
          this.setState({status: 'finish', result});
        }
      });
    }, 500);
  },

  openFolder() {
    electron.shell.showItemInFolder(this.state.result);
  }
});


const ScrotPage = React.createClass({
  getInitialState() {
    return {
      status: 'start'   // start | finish
    };
  },
  render() {
    let content;
    if (this.state.status === 'finish') {
      let images = [];
      _.each(this.state.result, (files, device) => {
        images.push(
          <div key={device}>
            <h3>iphone {device}</h3>
            {
              _.map(files, (f, index) => {
                return <img key={index} src={f} alt="" />
              })
            }
          </div>
        );
      });
      content = (
        <div>
          <div>截图已生成到 <a href="#" onClick={this.openFolder}>{ScrotKit.OUT_DIR}</a></div>
          {images}
        </div>
      );
    }

    return (
      <div className="container">
        <form>
          <div className="form-group">
            <label>选择截图文件</label>
            <input type="file" ref="file" accept="image/*" multiple />
          </div>
          <a href="#" className="btn btn-primary" onClick={this.generateScrots}>生成</a>
        </form>

        <hr />

        {content}
      </div>
    );
  },
  generateScrots() {
    if (this.refs.file.files.length === 0) {
      return;
    }
    if (this.state.status === 'finish') {
      this.setState({status: 'start'});
    }
    let files = _.map(this.refs.file.files, (f) => {
      return f.path;
    });

    setTimeout(() => {
      ScrotKit.generateIOS( files, (err, result) => {
        if (!err) {
          this.setState({status: 'finish', result});
        }
      } );
    }, 500);
  },

  openFolder() {
    electron.shell.showItemInFolder(ScrotKit.OUT_DIR);
  }
});

const Container = React.createClass({
  getInitialState() {
    return { };
  },

  render() {
    return (
      <div className="container" style={{marginTop: '20px'}}>
        <ul className="nav nav-pills nav-justified" role="tablist">
          <li role="presentation" className="active">
            <a href="#icon" aria-controls="icon" role="tab" data-toggle="tab">App Icon</a>
          </li>
          <li role="presentation">
            <a href="#scrot" aria-controls="scrot" role="tab" data-toggle="tab">AppStore Scrot</a>
          </li>
        </ul>
        <div className="tab-content">
          <div role="tabpanel" className="tab-pane active" id="icon">
            <IconPage />
          </div>
          <div role="tabpanel" className="tab-pane" id="scrot">
            <ScrotPage />
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <Container />,
  document.getElementById('main')
);
