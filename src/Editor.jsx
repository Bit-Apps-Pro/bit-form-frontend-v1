// import React from 'react';
// import {
//   BlockEditorProvider,
//   BlockList,
//   WritingFlow,
//   ObserveTyping,
// } from '@wordpress/block-editor';
// import { SlotFillProvider, Popover } from '@wordpress/components';
// import { registerCoreBlocks } from '@wordpress/block-library';

// // CSS for editor
// import '@wordpress/components/build-style/style.css';
// import '@wordpress/block-editor/build-style/style.css';

// // css for blocks
// import '@wordpress/block-library/build-style/style.css';
// import '@wordpress/block-library/build-style/editor.css';
// import '@wordpress/block-library/build-style/theme.css';

// function Editor() {
//   const [blocks, updateBlocks] = React.useState([]);

//   React.useEffect(() => {
//     registerCoreBlocks();
//   }, []);
//   return (
//     <BlockEditorProvider
//       value={blocks}
//       onInput={updateBlocks}
//       onChange={updateBlocks}
//     >
//       <SlotFillProvider>
//         <Popover.Slot name="block-toolbar" />
//         <WritingFlow>
//           <ObserveTyping>
//             <BlockList />
//           </ObserveTyping>
//         </WritingFlow>
//         <Popover.Slot />
//       </SlotFillProvider>
//     </BlockEditorProvider>
//   );
// }

// export default Editor;
