import os

entities = ['blogs', 'news']
capitalized_entities = ['Blog', 'News']
single_entities = ['blog', 'news']

api_path = "src/api/administrator"

for i in range(len(entities)):
    entity = entities[i]
    cap = capitalized_entities[i]
    single = single_entities[i]

    # getAll
    with open(f"{api_path}/{entity}/getAll{cap}s.js", "w") as f:
        f.write(f'''import {{ useQuery }} from "@tanstack/react-query";
import api from "../../../utils/axios";

const fetchAll{cap}s = async (page, limit, search) => {{
  const response = await api.post("/admin/{entity}/list", {{ page, limit, ...(search && {{ search }}) }});
  return response.data.data;
}};

export const useListAll{cap}s = (page = 1, limit = 10, search = "") => {{
  return useQuery({{
    queryKey: ["{entity}", page, limit, search],
    queryFn: () => fetchAll{cap}s(page, limit, search),
    keepPreviousData: true,
  }});
}};
''')

    # create
    with open(f"{api_path}/{entity}/create{cap}.js", "w") as f:
        f.write(f'''import {{ useMutation }} from "@tanstack/react-query";
import api from "../../../utils/axios";

const create{cap} = async (data) => {{
  const response = await api.post("/admin/{entity}/create", data);
  return response.data;
}};

export const useCreate{cap} = () => {{
  return useMutation({{ mutationFn: create{cap} }});
}};
''')

    # update
    with open(f"{api_path}/{entity}/update{cap}.js", "w") as f:
        f.write(f'''import {{ useMutation }} from "@tanstack/react-query";
import api from "../../../utils/axios";

const update{cap} = async ({{ id, data }}) => {{
  const response = await api.put(`/admin/{entity}/update/${{id}}`, data);
  return response.data;
}};

export const useUpdate{cap} = () => {{
  return useMutation({{ mutationFn: update{cap} }});
}};
''')

    # delete
    with open(f"{api_path}/{entity}/delete{cap}.js", "w") as f:
        f.write(f'''import {{ useMutation }} from "@tanstack/react-query";
import api from "../../../utils/axios";

const delete{cap} = async (id) => {{
  const response = await api.delete(`/admin/{entity}/delete/${{id}}`);
  return response.data;
}};

export const useDelete{cap} = () => {{
  return useMutation({{ mutationFn: delete{cap} }});
}};
''')

    # view
    with open(f"{api_path}/{entity}/view{cap}.js", "w") as f:
        f.write(f'''import {{ useQuery }} from "@tanstack/react-query";
import api from "../../../utils/axios";

const fetch{cap}Details = async (id) => {{
  const response = await api.get(`/admin/{entity}/${{id}}`);
  return response.data.data;
}};

export const useGet{cap}Details = (id) => {{
  return useQuery({{
    queryKey: ["{single}Detail", id],
    queryFn: () => fetch{cap}Details(id),
    enabled: !!id,
  }});
}};
''')
