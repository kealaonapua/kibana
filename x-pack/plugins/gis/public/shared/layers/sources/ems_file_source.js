/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { GIS_API_PATH } from '../../../../common/constants';
import { ASource } from './source';
import React, { Fragment } from 'react';
import {
  EuiText,
  EuiSelect,
  EuiSpacer
} from '@elastic/eui';

export class EMSFileSource extends ASource {

  static type = 'EMS_FILE';

  static createDescriptor(name) {
    return {
      type: EMSFileSource.type,
      name: name
    };
  }
  static async getGeoJson(descriptor) {
    try {
      const vectorFetch = await fetch(`../${GIS_API_PATH}/data/ems?name=${encodeURIComponent(descriptor.name)}`);
      return await vectorFetch.json();
    } catch(e) {
      console.error(e);
      throw e;
    }
  }

  static renderEditor({ dataSourcesMeta, onPreviewSource })  {

    const emsVectorOptionsRaw = (dataSourcesMeta) ? dataSourcesMeta.ems.file : [];
    const emsVectorOptions = emsVectorOptionsRaw ? emsVectorOptionsRaw.map((file) => ({ value: file.name, text: file.name })) : [];

    const onChange = ({ target }) => {
      const selectedId = target.options[target.selectedIndex].text;
      const emsFileSource = EMSFileSource.createDescriptor(selectedId);
      onPreviewSource(emsFileSource);
    };
    return (
      <EuiText>
        <Fragment>
          <EuiSpacer size="m"/>
          <EuiSelect
            options={emsVectorOptions}
            onChange={onChange}
            aria-label="Use aria labels when no actual label is in use"
          />
        </Fragment>
      </EuiText>
    );
  }

  constructor(descriptor) {
    super(descriptor);
  }

  renderDetails() {
    return (
      <Fragment>
        <div>
          <span className="bold">Source: </span><span>Elastic Maps Service</span>
        </div>
        <div>
          <span className="bold">Type: </span><span>Vector (todo, use icon)</span>
        </div>
        <div>
          <span className="bold">Name: </span><span>{this._descriptor.name}</span>
        </div>
        <div>
          <span className="bold">todo hotlink to EMS landing page</span>
        </div>
      </Fragment>
    );
  }

}