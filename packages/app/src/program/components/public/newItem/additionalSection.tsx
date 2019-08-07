import {Card, Divider, Input, Select} from 'antd';
import React, {Component, ReactNode} from 'react';

export interface AdditionalItemsInterface {
  name: string;
  value: string;
  type: string;
}

export interface AdditionalSectionInterface {
  sectionName: string;
  items: AdditionalItemsInterface[];
}

export interface AdditionalSectionProps {
  data: AdditionalSectionInterface;
}

export default class AdditionalSection extends Component<
  AdditionalSectionProps
> {
  render(): ReactNode {
    const selectionOptions = ['string', 'email', 'url'];
    const {sectionName, items} = this.props.data;

    return (
      <Card className="additionalSection">
        <Input
          type="text"
          placeholder="additional section name"
          defaultValue={sectionName}
        />
        {items.map((item, index) => (
          <div key={String(index)} className="additionalGroup">
            <Divider />
            <Input
              type="text"
              placeholder="item name"
              defaultValue={item.name}
            />
            <Input type="text" placeholder="value" defaultValue={item.value} />
            <Select defaultValue="string">
              {selectionOptions.map(item => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </div>
        ))}
      </Card>
    );
  }
}
