import React, { useState } from "react";
import { Button, Divider, Input, Modal, Typography, message } from "antd";
import { useConfig } from "../../globales/Context";
const { Text } = Typography;

const AddCate: React.FC = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (st: boolean) => void;
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState(
    "Les catégories classifient les produits selon leur nature, facilitant ainsi leur organisation et leur recherche pour les utilisateurs"
  );

  const [name, setName] = useState<string>();
  const { setConfig } = useConfig();

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    if (!name || name.length < 2) {
      message.error(
        "Vous devez mettre le nom de la catégorie pour valider\n Et le nom dois avoir au minimum 2 lettres "
      );
      setConfirmLoading(false);
      return;
    }
    window.ipc.send("addcategorieFood", { label: name });

    window.ipc.on("addcategorieFood", (data) => {
      //@ts-ignore
      if (data?.error) {
        //@ts-ignore
        message.error(data.message);
      } else {
        //@ts-ignore
        message.success(data.message);
        //@ts-ignore
        setConfig(data.data);
      }
    });
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  return (
    <>
      <Modal
        title="Ajouter une Catégorie"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Text style={{ textAlign: "center" }}>{modalText}</Text>
        <Divider />
        <div>
          <strong>Nom de la categorie</strong>
          <Input
            onChange={(e) => setName(e.target.value)}
            placeholder="Entrer le nom ici, exemple Boisson"
          />
        </div>
      </Modal>
    </>
  );
};

export default AddCate;
