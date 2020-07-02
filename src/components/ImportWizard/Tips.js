import React from 'react';
import { DarkTheme, ThemeProvider } from 'baseui';
import { ParagraphSmall, LabelMedium, LabelSmall } from 'baseui/typography';

export const hashTip = () => (
  <ThemeProvider theme={DarkTheme}>
    <LabelSmall>Transaction Hash Examples:</LabelSmall>
    <ParagraphSmall>
      0x9969ca31352a32f796320dac61594bca629f3b8a709ac7a8e40439fb74444624
      <br />
      0x8290eb16ee396b82b4f07f334a2b2585baa61be3de134fc7a3ff8faf2a98159c
    </ParagraphSmall>
    <LabelSmall>From Address Examples:</LabelSmall>
    <ParagraphSmall>0xa09871aeadf4994ca12f5c0b6056bbd1d343c029</ParagraphSmall>
    <LabelSmall>To Address Examples:</LabelSmall>
    <ParagraphSmall>
      0xc7d64e6509333a3b68f6fc09d7d19404bfdd229a
      <br />
      0x3408edca2d47ddaa783a3563d991b8ddebcd973b
      <br />
      0xb3a9b79f4d5dc2cdcdc00da22869502cbf65a0a5
    </ParagraphSmall>
  </ThemeProvider>
);

export const neighbourTip = () => (
  <ThemeProvider theme={DarkTheme}>
    <LabelSmall>Address Hash Examples:</LabelSmall>
    <ParagraphSmall>
      0xa09871aeadf4994ca12f5c0b6056bbd1d343c029
      <br />
      0xf52baeb41abf6a9001f42246d5a3a9e2677bc8f5
      <br />
      0xeed2bb3aa8edbb357756432da0223b8f3226887f
    </ParagraphSmall>
    <LabelSmall>Date Range Examples:</LabelSmall>
    <ParagraphSmall>27/11/2019 - 01/12/2019</ParagraphSmall>
  </ThemeProvider>
);

export const pathTip = () => (
  <ThemeProvider theme={DarkTheme}>
    <LabelMedium>Category/Transaction</LabelMedium>
    <br />
    <LabelSmall>Category Example:</LabelSmall>
    <ParagraphSmall>Exchange</ParagraphSmall>
    <LabelSmall>Transaction Hash Example:</LabelSmall>
    <ParagraphSmall>
      0x9969ca31352a32f796320dac61594bca629f3b8a709ac7a8e40439fb74444624
    </ParagraphSmall>

    <LabelMedium>Address/Address & Category/Address</LabelMedium>
    <br />
    <LabelSmall>From Address Examples:</LabelSmall>
    <ParagraphSmall>0xa09871aeadf4994ca12f5c0b6056bbd1d343c029</ParagraphSmall>
    <LabelSmall>Category Example:</LabelSmall>
    <ParagraphSmall>Hack</ParagraphSmall>
    <LabelSmall>To Address Examples:</LabelSmall>
    <ParagraphSmall>
      0xf52baeb41abf6a9001f42246d5a3a9e2677bc8f5
      <br />
      0x9409d7ea71294fc5561e5fdd47d4a9f5993948c5
      <br />
      0xeed2bb3aa8edbb357756432da0223b8f3226887f
    </ParagraphSmall>
    <LabelSmall>Date Range Examples:</LabelSmall>
    <ParagraphSmall>27/11/2019 - 05/12/2019</ParagraphSmall>
  </ThemeProvider>
);

export const fileTip =
  '.json file exported from the Export As button on the panel';

export const storageTip = 'Data saved by the Save Data button on the panel';
