import * as React from "react";

import * as api from "src/api";
import type { ChangeEvent } from "src/types";

import MarkDownEditor from "./components/MarkDownEditor";
import PreviewPanel from "./components/PreviewPanel";
import NavBar, { DialogType } from "./components/NavBar";
import LayoutOptionsDialog from "./components/LayoutSettingDialog";
import styles from "./style.scss";
import EditorSettingsDialog from "./components/EditorSettingsDialog";
import { EditorSettings, DEFAULT_EDITOR_SETTINGS } from "src/types";
import ErrorPanel from "./components/ErrorPanel";

export default function HomePage() {
  const [text, setText] = React.useState(""); // TODO: to be replaced
  const [preview, setPreview] = React.useState("");
  const [errorText, setErrorText] = React.useState(null);
  const [dialog, setDialog] = React.useState(null);
  const [editorSettings, setEditorSettings] = React.useState(DEFAULT_EDITOR_SETTINGS);

  const refresh = async () => {
    const res = await api.fetchPreview(text);
    if (res.error) {
      setErrorText(res.error);
    } else {
      setErrorText(null);
      setPreview(res.data.id);
    }
  };

  const download = async () => {
    const res = await api.fetchPreview(text);
    if (res.error) {
      alert(res.error);
    } else {
      setErrorText(null);
      api.download(res.data.id);
    }
  };

  const onChange = (e: ChangeEvent<string>) => {
    setText(e.newValue);
  };

  function onEditorSettingChange(e: ChangeEvent<EditorSettings>) {
    setEditorSettings(e.newValue);
  }

  return (
    <div className={styles.page}>
      <header>
        <NavBar refresh={refresh} download={download} setDialog={setDialog} />
      </header>
      <main className={styles.main}>
        <div className={styles.container}>
          <MarkDownEditor
            className={styles.editor}
            name="text"
            value={text}
            onChange={onChange}
            editorSettings={editorSettings}
          />
          {!!errorText ? (
            <ErrorPanel className={styles.preview} errorText={errorText} />
          ) : (
            <PreviewPanel className={styles.preview} id={preview} />
          )}
        </div>
        {dialog === DialogType.LayoutSetting && (
          <LayoutOptionsDialog
            onClose={() => setDialog(null)}
            name=""
            value={text}
            onChange={onChange}
          />
        )}
        {dialog === DialogType.EditorSetting && (
          <EditorSettingsDialog
            name=""
            value={editorSettings}
            onChange={onEditorSettingChange}
            onClose={() => setDialog(null)}
          />
        )}
      </main>
    </div>
  );
}
