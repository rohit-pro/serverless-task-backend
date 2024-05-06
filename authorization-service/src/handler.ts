import { AuthorizationService } from "./service";

export const basicAuthorizer = async (event: any, _:any, callback:any) => {
    return await AuthorizationService.basicAuthorizer(event, _, callback)
};
