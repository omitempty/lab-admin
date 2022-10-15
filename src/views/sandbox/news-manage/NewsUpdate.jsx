import React, { useState, useEffect, useRef } from "react";
import {
  Steps,
  Button,
  PageHeader,
  Form,
  Input,
  Select,
  message,
  notification,
} from "antd";
import style from "./NewsAdd.module.css";
import axios from "axios";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useNavigate, useParams } from "react-router-dom";
const { Step } = Steps;
const { Option } = Select;

export default function NewsUpdate() {
  const [current, setCurrent] = useState(0);
  const [categories, setCategories] = useState([]);
  const [editorState, setEditorState] = useState(null);
  const [form, setForm] = useState(null);
  const [content, setContent] = useState("");
  const [news, setNews] = useState(null);
  const navigate = useNavigate();
  const formRef = useRef(null);
  const params = useParams();

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  useEffect(() => {
    axios
      .get("/categories")
      .then((res) => {
        console.log(res.data);
        setCategories(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const url = `/news/${params.id}?_expand=role&_expand=category`;
    axios
      .get(url)
      .then((res) => {
        console.log(res.data);
        const { content, title, categoryId } = res.data;
        formRef.current.setFieldsValue({
          title,
          categoryId,
        });
        setNews(res.data);

        setContent(content);

        console.log(content);
        const contentBlock = htmlToDraft(content);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks
          );
          const editorState = EditorState.createWithContent(contentState);
          setEditorState(editorState);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [params.id]);

  const prev = () => {
    setCurrent(current - 1);
  };

  const next = () => {
    if (current === 0) {
      formRef.current
        .validateFields()
        .then((value) => {
          setForm(value);
          setCurrent(current + 1);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (content === "" || content.trim() === "<p></p>") {
        message.error("报告内容不能为空");
      } else {
        setCurrent(current + 1);
      }
    }
  };

  const handleUpdate = (auditState) => {
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    axios
      .patch(`/news/${news.id}`, {
        ...form,
        content: content,
        auditState: auditState,
      })
      .then((res) => {
        console.log(res);
        switch (auditState) {
          case 0:
            navigate("/news-manage/draft");
            break;
          case 1:
            navigate("/audit-manage/list");
            break;
          default:
            console.log("unexpected auditState", auditState);
        }

        notification.info({
          message: "通知",
          description: `您可以到${
            auditState === 0 ? "草稿箱" : "审核列表"
          }中查看您的报告`,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <PageHeader className="site-page-header" title="撰写报告" />
      <Steps current={current}>
        <Step title="基本信息" description="报告标题，报告分类" />
        <Step title="报告内容" description="报告主体内容" />
        <Step title="报告提交" description="保存草稿或者提交审核" />
      </Steps>

      <div
        className={current === 0 ? "" : style.invisible}
        style={{ paddingTop: "50px" }}
      >
        <Form ref={formRef} name="basic" {...layout}>
          <Form.Item
            label="报告标题"
            name="title"
            rules={[{ required: true, message: "请输入报告标题" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="报告分类"
            name="categoryId"
            rules={[{ required: true, message: "请输入报告分类" }]}
          >
            <Select>
              {categories.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </div>

      <div
        className={current === 1 ? "" : style.invisible}
        style={{ paddingTop: "50px" }}
      >
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={(editorState) => setEditorState(editorState)}
          onBlur={() =>
            setContent(
              draftToHtml(convertToRaw(editorState.getCurrentContent()))
            )
          }
        />
      </div>

      <div style={{ paddingTop: "10px" }}>
        {current > 0 && <Button onClick={prev}>上一步</Button>}
        {current < 2 && <Button onClick={next}>下一步</Button>}
        {current === 2 && (
          <Button type="primary" onClick={() => handleUpdate(0)}>
            更新草稿
          </Button>
        )}
        {current === 2 && (
          <Button type="danger" onClick={() => handleUpdate(1)}>
            提交审核
          </Button>
        )}
      </div>
    </>
  );
}
