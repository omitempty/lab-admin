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
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useNavigate } from "react-router-dom";
const { Step } = Steps;
const { Option } = Select;

// 我的写法居然跟antd一致诶，看来学习能力还是不错的
// 为什么人家的事件函数喜欢用闭包包一层呢，我记得好像有什么不重要的区别，是不是只是一种编码习惯

export default function NewsAdd() {
  const [current, setCurrent] = useState(0);
  const [categories, setCategories] = useState([]);
  const [editorState, setEditorState] = useState(null);
  const [form, setForm] = useState(null);
  // 不用这个content状态的话，每次从editorState取会有null的问题
  // 这个content相当于一个中间状态，解决了null的问题
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const formRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("token"));

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  useEffect(() => {
    // 之前漏掉了get，但是没有问题，说明axios的默认方法是get
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

  const prev = () => {
    setCurrent(current - 1);
  };

  const next = () => {
    // 步骤一下一步需要先校验表单
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
      console.log(form);
      console.log(content);
      if (content === "" || content.trim() === "<p></p>") {
        message.error("报告内容不能为空");
      } else {
        setCurrent(current + 1);
      }
    }
  };

  const handleSave = (auditState) => {
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    axios
      .post("/news", {
        ...form,
        content: content,
        region: user.region,
        author: user.username,
        roleId: user.roleId,
        auditState: auditState,
        publishState: 0,
        createTime: Date.Now,
        star: 0,
        view: 0,
      })
      .then((res) => {
        console.log(res);
        switch (auditState) {
          case 0:
            navigate("/news-manage/draft");
            break;
          case 1:
            navigate("/news-manage/list");
            break;
          default:
            console.log("unexpected auditState", auditState);
        }
        // navigate居然不影响后续代码执行
        // navigate只是改变数据来改变页面状态而已，对于程序执行流并没有什么影响
        notification.info({
          message: "提示",
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
      <PageHeader
        className="site-page-header"
        title="撰写报告"
        // subTitle="This is a subtitle"
      />
      <Steps current={current}>
        <Step title="基本信息" description="报告标题，报告分类" />
        <Step title="报告内容" description="报告主体内容" />
        <Step title="报告提交" description="保存草稿或者提交审核" />
      </Steps>

      {/* 条件渲染在react中真的是个很重要的技巧，但是要注意条件为假时组件会被卸载
       按钮没有状态无所谓，但是表单是有状态的，我们用css隐藏组件的方式来保存表单状态
       表单没有提供open属性，只能自己用css控制
       表单结构直接复制就好
       */}

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
              {/* 注意这里Option的用法，展示内容可以用children来设置 */}
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
          <Button type="primary" onClick={() => handleSave(0)}>
            保存草稿
          </Button>
        )}
        {current === 2 && (
          <Button type="danger" onClick={() => handleSave(1)}>
            提交审核
          </Button>
        )}
      </div>
    </>
  );
}
