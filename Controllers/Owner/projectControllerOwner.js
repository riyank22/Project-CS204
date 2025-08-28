const {prisma} = require("../../config/db")

exports.createProject = async (req, res) => {
    try{
        if(!req.body)
        {
            return res.status(400).send({
                message: "Bad Request: No data provided",
                success: false
            });
        }
        console.log("[INFO] Creating new project with data:", req.body);
        const {projectName, visibility, entry, maxCapacity, minCapacity, maxGroup, deadline}
            = req.body;
        if (!projectName || !maxCapacity || !minCapacity || !deadline) {
            console.log("[INFO] Missing required fields for project creation");
            return res.status(400).send({
                message: "Bad Request: Missing required fields",
                success: false
            });
        }

        if (maxCapacity < minCapacity) {
            console.log("[INFO] Max capacity is less than min capacity for project name :" + projectName);
            console.log("[INFO] Max Capacity:", maxCapacity, "Min Capacity:", minCapacity);
            return res.status(400).send({
                message: "Bad Request: Max capacity cannot be less than min capacity",
                success: false
            });
        }

        if(new Date(deadline) < new Date()) {
            console.log("[INFO] Deadline is in the past for project name :" + projectName);
            console.log("[INFO] Deadline:", deadline, "Current Time:", new Date());
            return res.status(400).send({
                message: "Bad Request: Deadline cannot be in the past",
                success: false
            });
        }

        const {user} = req;

        console.log("[INFO] Making entry in the db for the project name :" + projectName);
        const project = await prisma.projects.create(
            {
                data: {
                    name: projectName,
                    visibility: visibility || false,
                    entry: entry || false,
                    max_capacity: maxCapacity,
                    min_capacity: minCapacity,
                    max_group: maxGroup ? maxGroup : null,
                    deadline: new Date(deadline),
                    created_by: JSON.stringify({
                        name: user.name,
                        email: user.email,
                        id: user.id
                    }),
                    owner_id: user.id,
                }
            }
        )

        if(!project) {
            console.log("[INFO] Project not found for project name :" + projectName);
            return res.status(500).send({
                message: "Internal Server Error: Unable to create project",
                success: false
            });
        }

        console.log("[INFO] Created new project with id:", project.id);

        res.status(201).send({
            message: "Created new project",
            success: true,
            project: {
                id: project.uuid,
                name: project.name,
                visibility: project.visibility,
                entry: project.entry,
                max_capacity: project.max_capacity,
                min_capacity: project.min_capacity,
                max_group: project.max_group,
                deadline: project.deadline,
                created_at: project.created_at,
                updated_at: project.updated_at,
                created_by: JSON.parse(project.created_by),
            },
        })
    }
    catch (error) {
        console.error("[ERROR] Error in createProject:", error);
        res.status(500).send({
            message: "Internal Server Error",
            success: false
        });
    }
};

exports.getProjectList = async (req, res) => {
    try {
        const user = req.user;

        console.log("[INFO] Fetching project list for User ID:", user.id);

        const projects = await prisma.projects.findMany({
            where: {
                owner_id: user.id
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        if (!projects || projects.length === 0) {
            console.log("[INFO] No projects found for User ID:", user.id);
            return res.status(200).send({
                message: "No projects found",
                success: true,
                projects: []
            });
        }

        console.log("[INFO] Fetched", projects.length, "projects for User ID:", user.id);

        // Format the projects to include only necessary fields
        const result = projects.map(project => ({
            id: project.uuid,
            name: project.name,
            visibility: project.visibility,
            entry: project.entry,
            deadline: project.deadline,
            created_at: project.created_at,
            updated_at: project.updated_at
        }));

        res.status(200).send({
            message: "Project list fetched successfully",
            success: true,
            projects: result
        });
    } catch (error) {
        console.error("[ERROR] Error fetching project list for User ID:", error);
        res.status(500).send({
            message: "Internal Server Error",
            success: false
        });
    }
}