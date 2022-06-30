import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Form } from "react-bootstrap";

import Page from "../../components/Page";
import ListView from "../../components/ListView";
import Modal from "../../components/Modal";
import api from "../../services/axios";

const endpoint="/courses";
const columns = [
    {value: "ID", id:"id"},
    {value: "Name", id:"name"},
];

const INITIAL_STATE = {id:0, name:""};


const Courses = () => {
    const [visible, setVisible] = useState(false);
    const [course, setCourse] = useState(INITIAL_STATE);

    const handleSave = async(refetch) => {
        try {
            if(course.id){
                await api.put(`${endpoint}/${course.id}`,{name:course.name});
                toast.success("Atualizado com sucesso");
            } else {
                await api.post(endpoint, {name:course.name});
                toast.success("Curso cadastrado com sucesso!");
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
            action:(_course)=>{
                setCourse(_course);
                setVisible(true);
            },
        },
        {
            
                name:"remove",
                action:async(course,refetch)=>{
                    if(window.confirm("Você tem certeza disso?")){
                        try{
                            await api.delete(`${endpoint}/${course.id}`);
                            await refetch();
                            toast.info(`Curso ${course.name} foi removido`);
                        }catch(error){
                            toast.info(error.menssage);
                        }

                    }
                },
            
        }
    ];

    return(
        <Page title="Courses">
        
        <Button className="mb-2" 
        onClick={()=>{
            setCourse(INITIAL_STATE);
            setVisible(true);
        }}> Create course</Button>

        <ListView
        actions={actions}
        columns={columns}
        endpoint={endpoint}
        >
            {({refetch}) => ( 
                <Modal
                title={`${course.id ? "Update" : "Create"} Course`}
                show={visible}
                handleSave={() => handleSave(refetch)}
                handleClose={() => handleClose()}
                >
                <Form>
                    <Form.Group>
                        <Form.Label>Course Name</Form.Label>
                        <Form.Control
                        name="Course"
                        onChange={(event)=>
                            setCourse({...course, name: event.target.value})
                        }
                        value={course.name}
                        />
                    </Form.Group>
                </Form>    
                </Modal>
                
            )}
        </ListView>
        </Page>
    );
};

export default Courses;