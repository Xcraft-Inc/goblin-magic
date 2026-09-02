import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget/index.js';
import {v4 as uuidV4} from 'uuid';
import withC from 'goblin-laboratory/widgets/connect-helpers/with-c.js';
import C from 'goblin-laboratory/widgets/connect-helpers/c.js';

class DidUpdateNC extends Widget {
  componentDidUpdate() {
    this.props.children(this.props);
  }

  render() {
    return null;
  }
}

const DidUpdate = withC(DidUpdateNC);

/**
 * This Widget has a function to get the result of a backend quest.
 * You should not use it unless you have a very good reason.
 * It could be replaced when we will have ui events from the backend.
 */
class WidgetWithQuest extends Widget {
  constructor() {
    super(...arguments);
    this.state = {
      questId: null,
    };
    this.subRender = this.render;
    this.render = () => {
      return (
        <>
          <DidUpdate
            result={C(
              this.state.questId
                ? `backend.widgetWithQuest.results.${this.state.questId}`
                : null
            )}
          >
            {({result}) => {
              if (this.questResult && result) {
                this.questResult.resolve(result.get('value'));
              }
            }}
          </DidUpdate>
          {this.subRender()}
        </>
      );
    };
  }

  doQuest = async (serviceId, questName, questArgs) => {
    const questId = uuidV4();
    this.setState({questId});
    this.questResult = Promise.withResolvers();
    this.doFor('widgetWithQuest', 'doQuest', {
      questId,
      serviceId,
      questName,
      questArgs,
    });
    const resultValue = await this.questResult.promise;
    this.questResult = null;
    this.doFor('widgetWithQuest', 'clearResult', {questId});
    return resultValue;
  };
}

export default WidgetWithQuest;
