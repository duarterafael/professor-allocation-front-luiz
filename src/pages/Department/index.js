import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Form } from "react-bootstrap";

import Page from "../../components/Page";
import ListView from "../../components/ListView";
import Modal from "../../components/Modal";
import api from "../../services/axios";

const endpoint="/departments";
const columns = [
    {value: "ID", id:"id"},
    {value: "Name", id:"name"},
];

const INITIAL_STATE = {id:0, name:""};


const Department = () => {
    const [visible, setVisible] = useState(false);
    const [department, setDepartment] = useState(INITIAL_STATE);

    const handleSave = async(refetch) => {
        try {
            if(department.id){
                await api.put(`${endpoint}/${department.id}`,{name:department.name});
                toast.success("Atualizado com sucesso");
            } else {
                await api.post(endpoint, {name:department.name});
                toast.success("Departamento cadastrado com sucesso!");
            }
            setVisible(false);
            await refetch();
        } catch (error){
            toast.error(error.message);
        }
    };

    const handleClose = () => setVisible(false);

    const actions =[
        {
            name:"edit",
            action:(_department)=>{
                setDepartment(_department);
                setVisible(true);
            },
        },
        {
            
                name:"remove",
                action:async(department,refetch)=>{
                    if(window.confirm("Você tem certeza disso?")){
                        try{
                            await api.delete(`${endpoint}/${department.id}`);
                            await refetch();
                            toast.info(`Department ${department.name} foi removido`);
                        }catch(error){
                            toast.info(error.menssage);
                        }

                    }
                },
            
        }
    ];

    return(
        <Page title="Departments">
        
        <Button className="mb-2" 
        onClick={()=>{
            setDepartment(INITIAL_STATE);
            setVisible(true);
        }}> Create department</Button>

        <ListView
        actions={actions}
        columns={columns}
        endpoint={endpoint}
        >
            {({refetch}) => ( 
                <Modal
                title={`${department.id ? "Update" : "Create"} Department`}
                show={visible}
                handleSave={() => handleSave(refetch)}
                handleClose={() => handleClose()}
                >
                <Form>
                    <Form.Group>
                        <Form.Label>Department Name</Form.Label>
                        <Form.Control
                        name="Department"
                        onChange={(event)=>
                            setDepartment({...department, name: event.target.value})
                        }
                        value={department.name}
                        />
                    </Form.Group>
                </Form>    
                </Modal>
                
            )}
        </ListView>
        </Page>
    );
};

export default Department;