angular
  .module('portainer.edge')
  .controller('EditEdgeGroupController', function EditEdgeGroupController(
    EdgeGroupService,
    EndpointService,
    GroupService,
    TagService,
    Notifications,
    $state,
    $scope
  ) {
    this.state = {
      actionInProgress: false
    };

    this.$onInit = async function $onInit() {
      const [tags, endpoints, endpointGroups, group] = await Promise.all([
        TagService.tags(),
        EndpointService.endpoints(),
        GroupService.groups(),
        EdgeGroupService.group($state.params.groupId)
      ]);

      if (!group) {
        Notifications.error('Failed to find edge group', {});
        $state.go('edge.groups');
      }
      this.tags = tags.map(t => t.Name);
      this.endpoints = endpoints.value;
      this.endpointGroups = endpointGroups;
      this.model = group;
      // TODO remove
      $scope.$digest();
    };

    this.updateGroup = updateGroup.bind(this);

    async function updateGroup() {
      this.state.actionInProgress = true;
      try {
        await EdgeGroupService.update(this.model.Id, this.model);
        Notifications.success('Edge group successfully updated');
        $state.go('edge.groups');
      } catch (err) {
        Notifications.error('Failure', err, 'Unable to update edge group');
      }
      this.state.actionInProgress = false;
    }
  });