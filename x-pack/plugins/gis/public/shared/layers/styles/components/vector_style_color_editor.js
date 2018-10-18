/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Fragment } from 'react';
import { VectorStyle } from '../vector_style';
import { DynamicColorSelection } from './dynamic_color_selection';
import { StaticColorSelection } from './static_color_selection';
import _ from 'lodash';

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiSwitch
} from '@elastic/eui';


export class VectorStyleColorEditor extends React.Component {


  static _getFallbackDescriptor() {
    return {
      type: VectorStyle.STYLE_TYPE.STATIC,
      options: {
        color: null
      }
    };
  }

  constructor() {
    super();
    this.state = {
      colorStyleDesciptor: null,
      ordinalFields: null
    };
    this._lastStaticOptions = null;
  }

  _isDynamic() {
    return this.state.colorStyleDesciptor.type === VectorStyle.STYLE_TYPE.DYNAMIC;
  }

  async _loadOrdinalFields() {
    const ordinalFields = await this.props.layer.getOrdinalFields();

    //check if fields are the same..
    const eqls = _.isEqual(ordinalFields, this.state.ordinalFields);
    if (!eqls) {
      this.setState({
        ordinalFields: ordinalFields
      });
    }
  }

  _renderFillAndOutlineStyle() {

    this._loadOrdinalFields();

    const changeToStaticColor = (newOptions) => {
      const staticStyle = {
        type: VectorStyle.STYLE_TYPE.STATIC,
        options: newOptions
      };
      this.props.handlePropertyChange(this.props.property, staticStyle);
      return staticStyle;
    };

    const changeToDynamicColor = (field) => {
      const dynamicStyle = {
        type: VectorStyle.STYLE_TYPE.DYNAMIC,
        options: {
          fieldValue: field ? field.value : undefined
        }
      };
      this.props.handlePropertyChange(this.props.property, dynamicStyle);
      return dynamicStyle;
    };

    const onTypeToggle = (e) => {
      const selectedStyle = e.target.checked ? VectorStyle.STYLE_TYPE.DYNAMIC : VectorStyle.STYLE_TYPE.STATIC;
      let newStyle;
      if (selectedStyle === VectorStyle.STYLE_TYPE.STATIC) {
        newStyle = changeToStaticColor(this._lastStaticOptions);
      } else {
        newStyle = changeToDynamicColor();
      }
      this.setState({
        colorStyleDesciptor: newStyle
      });
    };

    let colorSelector;
    if (this._isDynamic()) {
      if (this.state.ordinalFields !== null) {
        colorSelector = (
          <DynamicColorSelection
            fields={this.state.ordinalFields}
            onChange={changeToDynamicColor}
            selectedOptions={this.props.colorStyleDescriptor.options}
          />
        );
      } else {
        colorSelector = null;
      }
    } else {
      const selectedOptions = (this.props.colorStyleDescriptor && this.props.colorStyleDescriptor.options) ?
        this.props.colorStyleDescriptor.options : null;
      this._lastStaticOptions = selectedOptions;
      colorSelector = (<StaticColorSelection changeOptions={changeToStaticColor} selectedOptions={selectedOptions}/>);
    }

    return (
      <Fragment>
        <EuiFlexItem grow={false}>
          {this.props.name}
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiSwitch
            label={this._isDynamic() ? 'Dynamic' : 'Static'}
            checked={this._isDynamic()}
            onChange={onTypeToggle}
          />
        </EuiFlexItem>
        <EuiFlexItem grow={true}>
          {colorSelector}
        </EuiFlexItem>
      </Fragment>
    );
  }


  render() {

    if (this.state.colorStyleDesciptor === null) {
      this.state.colorStyleDesciptor = this.props.colorStyleDescriptor || VectorStyleColorEditor._getFallbackDescriptor();
    }

    return (
      <EuiFlexGroup alignItems="center" justifyContent="spaceEvenly">
        {this._renderFillAndOutlineStyle()}
      </EuiFlexGroup>
    );
  }

}



