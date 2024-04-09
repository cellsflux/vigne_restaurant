import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload, message } from "antd";
//@ts-ignore
import type { GetProp, UploadFile, UploadProps } from "antd";
import { Col, DatePicker, Row, Select, Space } from "antd";

import { Button, Checkbox, Form, type FormProps, Input } from "antd";
import { useConfig } from "../../globales/Context";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    //@ts-ignore
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const FormAddProduct: React.FC = (
  //@ts-ignore
  { data }
) => {
  const LISTCAT = data.cluster.documents.category_product_restau
    .filter((obj) => obj.label !== "All") // Filtrer les objets dont le nom n'est pas "11"
    .map((obj) => ({ ...obj, value: obj.label }));
  type InputType = {
    name?: string;
    price: number;
    categorie_produc: string;
    qt?: number;
  };
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { setConfig } = useConfig();
  const [form] = Form.useForm();

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);

      //console.log(await getBase64(file.originFileObj as FileType));
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Charger une Image</div>
    </button>
  );

  const onFinish: FormProps<InputType>["onFinish"] = async (values) => {
    if (fileList.length < 1) {
      message.error("Vous devez ajouter une image svp");
      return;
    }
    // Utilisation de Promise.all pour attendre que toutes les conversions soient terminées
    const imagePromises = fileList.map(async (file) => {
      return await getBase64(file.originFileObj as FileType);
    });

    // Utilisation de Promise.all pour attendre que toutes les conversions soient terminées
    const image = await Promise.all(imagePromises);
    let isStok = false;
    if (values.qt && values.qt != undefined && values.qt !== null) {
      isStok = true;
    }

    let data = {
      image: image,
      name: values.name,
      price: values.price,
      stok: isStok,
      categorie: values.categorie_produc,
      qt: values.qt,
    };
    //console.log("Success:", data);
    window.ipc.send("savefood_Product", data);
    window.ipc.on("savefood_Product", (mess) => {
      //@ts-ignore
      if (mess.error) {
        //@ts-ignore
        message.error(mess.message);
      } else {
        //@ts-ignore
        setConfig(mess.data);
        setFileList([]);
        form.resetFields();
        //@ts-ignore
        message.success(mess.message);
      }
    });
  };

  const onFinishFailed: FormProps<InputType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  //CTEGORIES FUNCTIONS

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value: string) => {
    console.log("search:", value);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div>
        <Upload
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>

      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item<InputType>
              label="Nom "
              name="name"
              rules={[
                { required: true, message: "Entre le nom du produit svp" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<InputType>
              label="Categorie"
              name="categorie_produc"
              rules={[{ required: true, message: "Categorie avp" }]}
            >
              <Select
                size={"large"}
                onChange={onChange}
                style={{ width: 200 }}
                options={LISTCAT}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item<InputType>
              label="Quantité"
              name="qt"
              rules={[{ required: false, message: "Entre la quantité" }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<InputType>
              label="Prix"
              name="price"
              rules={[{ required: true, message: "Entre le prix svp" }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Enregistrer
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormAddProduct;
