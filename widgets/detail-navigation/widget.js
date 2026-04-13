import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import Splitter from '../splitter/widget.js';
import WithModel from 'goblin-laboratory/widgets/with-model/widget.js';
import MagicButton from '../magic-button/widget.js';
import Icon from '@mdi/react';
import {mdiClose, mdiOpenInNew} from '@mdi/js';
import T from 'goblin-nabu/widgets/helpers/nabu.js';
import getModifiers from '../get-modifiers/get-modifiers.js';

class MainDetailNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  open = (entityId, event) => {
    const modifiers = getModifiers(event);
    this.doFor(this.props.id, 'open', {
      entityId,
      modifiers,
    });
  };

  backDetail = () => {
    this.doFor(this.props.id, 'backDetail');
  };

  closeDetail = (event) => {
    this.doFor(this.props.id, 'closeDetail');
  };

  openDetailInNewTab = (event) => {
    const modifiers = getModifiers(event);
    this.doFor(this.props.id, 'openDetailInNewTab', {modifiers});
  };

  renderDetail() {
    const {
      parentWorkitemId,
      detailId,
      detailServiceId,
      detailWidgets,
      emptyDetail,
    } = this.props;
    if (!detailId) {
      return emptyDetail || <div></div>;
    }
    const type = detailId.split('@', 1)[0];
    const DetailWidget = detailWidgets[type];
    if (!DetailWidget) {
      throw new Error(
        `No widget found to display '${detailId}'. Please add a widget for '${type}' in detailWidgets.`
      );
    }
    return (
      <WithModel model={`backend.${detailServiceId}`}>
        <DetailWidget
          className={this.styles.classNames.detail}
          id={detailServiceId}
          onBack={this.backDetail}
          parentWorkitemId={parentWorkitemId}
          // actionsPanel={false}
          actions={
            <div>
              <MagicButton
                simple
                onClick={this.openDetailInNewTab}
                title={T('Ouvrir dans un nouvel onglet')}
              >
                <Icon path={mdiOpenInNew} />
              </MagicButton>
              <MagicButton
                simple
                onClick={this.closeDetail}
                title={T('Fermer le détail')}
              >
                <Icon path={mdiClose} />
              </MagicButton>
            </div>
          }
        />
      </WithModel>
    );
  }

  render() {
    const {
      children,
      parentWorkitemId,
      detailId,
      detailServiceId,
      detailWidgets,
      className = '',
      ...props
    } = this.props;
    return (
      <Splitter
        className={this.styles.classNames.mainDetail}
        primaryMinSize={25}
        secondaryMinSize={25}
        secondaryInitialSize={60}
        percentage={true}
        {...props}
      >
        {typeof children === 'function'
          ? children({open: this.open, detailId, detailServiceId})
          : children}
        {this.renderDetail()}
      </Splitter>
    );
  }
}

const MainDetail = Widget.connectBackend((state) => {
  return {
    parentWorkitemId: state.get('parentWorkitemId'),
    detailId: state.get('detailId'),
    detailServiceId: state.get('detailServiceId'),
  };
})(MainDetailNC);

const DetailNavigation = {
  MainDetail,
};

export default DetailNavigation;
