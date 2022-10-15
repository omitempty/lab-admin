import { createContext, useContext, useEffect, useState, useRef } from "react";
import { Table, Button, Modal, Form, Input } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
const { confirm } = Modal;

const EditableContext = createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default function NewsCategory() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [open, setOpen] = useState(false);

  const formRef = useRef();

  useEffect(() => {
    axios
      .get(`/categories`)
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [refresh]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => <b>{id}</b>,
    },
    {
      title: "报告名称",
      dataIndex: "title",
      editable: true,
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: "title",
        title: "报告名称",
        handleSave,
      }),
    },
    {
      title: "操作",
      render: (news) => (
        <div>
          <Button
            type="danger"
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => confirmDelete(news)}
          />
        </div>
      ),
    },
  ];

  const handleSave = (row) => {
    const data = [...categories];
    const index = data.findIndex((item) => row.id === item.id);
    const item = data[index];

    console.log(item, row);
    data.splice(index, 1, { ...item, ...row });
    setCategories(data);

    axios
      .put(`/categories/${row.id}`, {
        title: row.title,
        value: row.value,
      })
      .catch((error) => console.log(error));
  };

  const confirmDelete = (item) => {
    confirm({
      title: "是否删除？",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleDelete(item);
      },
    });
  };

  const handleDelete = (item) => {
    console.log(item);
    setLoading(true);
    const url = `/categories/${item.id}`;
    console.log(url);
    axios
      .delete(url)
      .then(() => {
        setLoading(false);
        setRefresh(!refresh);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleAddCategory = () => {
    formRef.current
      .validateFields()
      .then(() => {
        const { title } = formRef.current.getFieldsValue();
        return axios.post("/categories", {
          title,
          value: title,
        });
      })
      .then(() => {
        setOpen(false);

        setRefresh(!refresh);
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        新增分类
      </Button>
      <Table
        columns={columns}
        dataSource={categories}
        rowKey={(item) => item.id}
        pagination={{ pageSize: 10 }}
        scroll={{ y: "650px" }}
        loading={loading}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
      />
      <Modal
        open={open}
        title="新增分类"
        okText="确定"
        cancelText="取消"
        onCancel={() => setOpen(false)}
        onOk={handleAddCategory}
      >
        <Form ref={formRef}>
          <Form.Item
            name="title"
            label="报告名称"
            rules={[{ required: true, message: "请输入报告名称" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
