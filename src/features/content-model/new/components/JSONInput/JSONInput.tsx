import { useEffect, useRef } from 'react';

import Button from '@/src/shared/components/Button/Button';
import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup';
import { json } from '@codemirror/lang-json';

import styles from './JSONInput.module.css';

interface JSONInputProps {
  onChange: (value: string) => void;
  validateContentModel: (contentModelText: string) => void;
  contentModelJSONText: string;
  viewError: string | null;
}

const JSONInput: React.FC<JSONInputProps> = (props) => {
  const {
    onChange,
    contentModelJSONText,
    validateContentModel,
    viewError,
  } = props;
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current === null) {
      return;
    }

    const editorView = new EditorView({
      state: EditorState.create({
        extensions: [basicSetup, json()],
        doc: contentModelJSONText,
      }),
      parent: editorRef.current,
      dispatch: (tr) => {
        editorView.update([tr]);
        onChange(editorView.state.doc.toString());
      },
    });

    return () => {
      editorView.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorRef]);

  return (
    <>
      <div className="p-4 mt-8 bg-white rounded-lg focus-within:ring-2">
        <h3 className="text-lg font-semibold">Content Model JSON:</h3>
        <div ref={editorRef} className={`mt-4 ${styles.editorWrap}`} />
      </div>
      {viewError !== null ? (
        <p className="mt-4 text-base text-red-700">{viewError}</p>
      ) : null}
      <footer className="mt-8 flex justify-end">
        <Button
          color="primary"
          onClick={() => {
            validateContentModel(contentModelJSONText);
          }}
        >
          Validate and continue
        </Button>
      </footer>
    </>
  );
};

export default JSONInput;
