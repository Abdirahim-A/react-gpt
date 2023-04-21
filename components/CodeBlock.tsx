import { node } from 'prop-types';
import React, { useState } from 'react';
import chalk from 'chalk';
import { diffLines } from 'diff';
import { CopyBlock, atomOneLight } from 'react-code-blocks';

function CodeBlock(props: any) {
  //   let var_name = '';
  //   let var_value = '';
  //   if (props.node?.data?.meta === 'live') {
  //     console.log(props.node.children[0].value);
  //     const code = props.node.children[0].value.split('==>')[0];
  //     const result = props.node.children[0].value.split('==>')[1];
  //     var_name = code.split('=')[0];
  //     var_value = code.split('=');
  //     console.log(code, result, var_name, var_value);
  //   }

  //   const getCodeNodes = (document: any) => {
  //     return document.children
  //       .filter(
  //         ({ type, lang, meta }: any) =>
  //           type === 'code' && lang === 'deci' && meta === 'live'
  //       )
  //       .map((node: any) => {
  //         const [code, snapshot = '(no snapshot)'] = node.value.split('==>');

  //         return { node, code, snapshot };
  //       });
  //   };

  //   const nodes = getCodeNodes(props);
  //   const results = ['1', '1', '1', '1', '1'];

  //   for (let i = 0; i < nodes.length; i += 1) {
  //     const { node, code, snapshot } = nodes[i];
  //     const actualValue = results[i];
  //     console.log({node}, {code}, {snapshot})

  //     diffLines(snapshot, actualValue).forEach((part) => {
  //       const colorizeLine = part.added
  //         ? (s: any) => chalk.green(`+ ${s}`)
  //         : part.removed
  //         ? (s: any) => chalk.red(`- ${s}`)
  //         : (s: any) => `  ${s}`;

  //       const lines = part.value.split('\n').map(colorizeLine).join('\n');

  //       console.error(lines);
  //     });

  //     node.value = code + '======' + actualValue;
  //     console.log(node.value);
  //   }

  //   if(!props.node?.data?.meta === 'live'){
  //     return <p>{props.node.value[0]}</p>
  //   }
  //   console.log(props);

  if (props.node?.data?.meta === 'live') {
    return (
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <CopyBlock
          text={props.node.children[0].value}
          language={'javascript'}
          theme={atomOneLight}
          wrapLines
        />
      </div>
    );
  } else {
    return <span style={{fontWeight: 'bold'}}>{props.node.children[0].value}</span>;
  }
}
export default CodeBlock;
